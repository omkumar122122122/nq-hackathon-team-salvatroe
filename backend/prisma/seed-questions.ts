import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const defaultQuestions = [
  // Ages 0 - 5 (Early Childhood Welfare)
  {
    minAge: 0,
    maxAge: 5,
    category: 'HEALTH_SAFETY',
    question: 'Does the child receive regular pediatrician check-ups and vaccinations?',
  },
  {
    minAge: 0,
    maxAge: 5,
    category: 'EMOTIONAL_BONDING',
    question: 'How does the child react when seeking comfort or reassurance from parents?',
  },
  {
    minAge: 0,
    maxAge: 5,
    category: 'NUTRITION_CARE',
    question: 'Are there any dietary issues or sleep disturbances observed?',
  },
  {
    minAge: 0,
    maxAge: 5,
    category: 'DEVELOPMENT',
    question: 'Does the child show age-appropriate developmental milestones, speech, and motor skills?',
  },
  {
    minAge: 0,
    maxAge: 5,
    category: 'SAFETY_WELLBEING',
    question: 'Is the living environment safe, child-proofed, and free from any hazards?',
  },

  // Ages 6 - 10 (Primary School & Socialization)
  {
    minAge: 6,
    maxAge: 10,
    category: 'EDUCATION',
    question: 'How is the child adapting to school, teachers, and classmates?',
  },
  {
    minAge: 6,
    maxAge: 10,
    category: 'EMOTIONAL_BONDING',
    question: 'Do you feel comfortable and happy sharing your daily activities with your family?',
  },
  {
    minAge: 6,
    maxAge: 10,
    category: 'HEALTH_SAFETY',
    question: 'Do you feel safe, cared for, and supported at home?',
  },
  {
    minAge: 6,
    maxAge: 10,
    category: 'SOCIAL_INTERACTION',
    question: 'Does the child participate in extracurricular or community play activities?',
  },
  {
    minAge: 6,
    maxAge: 10,
    category: 'DAILY_ROUTINE',
    question: 'How is the child managing daily homework, sleep schedule, and nutrition at home?',
  },

  // Ages 11 - 16 (Adolescence & Development)
  {
    minAge: 11,
    maxAge: 16,
    category: 'EMOTIONAL_BONDING',
    question: 'How openly do you discuss personal challenges or concerns with your parents?',
  },
  {
    minAge: 11,
    maxAge: 16,
    category: 'SAFETY_WELLBEING',
    question: 'Do you feel respected, safe, and emotionally secure in your family environment?',
  },
  {
    minAge: 11,
    maxAge: 16,
    category: 'EDUCATION_GROWTH',
    question: 'What are your goals and interests, and does your family support your aspirations?',
  },
  {
    minAge: 11,
    maxAge: 16,
    category: 'HEALTH_SAFETY',
    question: 'Are there any signs of emotional stress, anxiety, or behavioral changes?',
  },
  {
    minAge: 11,
    maxAge: 16,
    category: 'FUTURE_READINESS',
    question: 'Does the adolescent feel confident and optimistic about their future, education, and career paths?',
  },
];

async function seed() {
  console.log('Seeding Post-Adoption Welfare Assessment Questions...');

  const existing = await prisma.question.findMany({ select: { question: true } });
  const existingSet = new Set(existing.map((q) => q.question));
  const missing = defaultQuestions.filter((q) => !existingSet.has(q.question));

  if (missing.length > 0) {
    await prisma.question.createMany({
      data: missing,
    });
    console.log(`Successfully seeded ${missing.length} missing assessment questions.`);
  } else {
    console.log(`Questions table already populated with all ${defaultQuestions.length} default questions.`);
  }

  await prisma.$disconnect();
}

if (require.main === module) {
  seed().catch((e) => {
    console.error('Error seeding questions:', e);
    prisma.$disconnect();
    process.exit(1);
  });
}
