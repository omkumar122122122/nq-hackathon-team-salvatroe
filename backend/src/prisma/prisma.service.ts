import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      // NOTE: Do NOT add datasources here — Prisma reads DATABASE_URL from env.
      // Only log config is set; no connection_limit override needed since
      // Neon's PgBouncer pooler URL already controls pool size.
      log: [
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
    // IMPORTANT: Do NOT add a $use middleware that calls $disconnect()/$connect().
    // Prisma manages connection health internally. Manually reconnecting inside
    // middleware causes a thundering-herd: every concurrent request that hits a
    // transient error will race to reconnect, exhausting the pool (P2024).
  }

  async onModuleInit() {
    let retries = 5;
    let connected = false;
    while (retries > 0 && !connected) {
      try {
        await this.$connect();
        connected = true;
        this.logger.log('Prisma connected to primary database');
      } catch (err: any) {
        retries--;
        if (retries > 0) {
          this.logger.warn(
            `Initial Prisma connection attempt failed (Neon Serverless wake-up/cold start): ${err.message}. Retrying in 2s... (${retries} attempts left)`,
          );
          await new Promise((res) => setTimeout(res, 2000));
        } else {
          this.logger.error(`Initial Prisma connection error: ${err.message}`);
        }
      }
    }

    // Log slow queries in development
    if (process.env.NODE_ENV === 'development') {
      (this.$on as any)('query', (e: any) => {
        if (e.duration > 200) {
          this.logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
        }
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }

  /**
   * Soft-delete helper — sets deletedAt instead of removing the record.
   */
  async softDelete(model: string, id: string): Promise<void> {
    await (this as any)[model].update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Clean up expired tokens — call from a scheduled job.
   */
  async cleanExpiredTokens(): Promise<{ refreshTokens: number; otpTokens: number }> {
    const now = new Date();

    const [refreshTokens, otpTokens] = await Promise.all([
      this.refreshToken.deleteMany({
        where: { OR: [{ expiresAt: { lt: now } }, { isRevoked: true }] },
      }),
      this.otpToken.deleteMany({
        where: { OR: [{ expiresAt: { lt: now } }, { isUsed: true }] },
      }),
    ]);

    return { refreshTokens: refreshTokens.count, otpTokens: otpTokens.count };
  }
}
