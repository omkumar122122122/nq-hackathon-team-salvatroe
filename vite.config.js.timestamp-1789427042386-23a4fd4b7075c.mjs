// vite.config.js
import { defineConfig } from "file:///C:/Users/OM%20KUMAR%20GUPTA/OneDrive/Desktop/nq%20hackathon%20team%20salvatroe/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/OM%20KUMAR%20GUPTA/OneDrive/Desktop/nq%20hackathon%20team%20salvatroe/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      // Forward all /api/v1 requests to the NestJS backend
      // Eliminates CORS issues in development
      "/api/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      },
      // Forward all /uploads requests to NestJS static file server
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxPTSBLVU1BUiBHVVBUQVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXG5xIGhhY2thdGhvbiB0ZWFtIHNhbHZhdHJvZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcT00gS1VNQVIgR1VQVEFcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxucSBoYWNrYXRob24gdGVhbSBzYWx2YXRyb2VcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL09NJTIwS1VNQVIlMjBHVVBUQS9PbmVEcml2ZS9EZXNrdG9wL25xJTIwaGFja2F0aG9uJTIwdGVhbSUyMHNhbHZhdHJvZS92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICBwb3J0OiA1MTczLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy8gRm9yd2FyZCBhbGwgL2FwaS92MSByZXF1ZXN0cyB0byB0aGUgTmVzdEpTIGJhY2tlbmRcclxuICAgICAgLy8gRWxpbWluYXRlcyBDT1JTIGlzc3VlcyBpbiBkZXZlbG9wbWVudFxyXG4gICAgICBcIi9hcGkvdjFcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgICAgfSxcclxuICAgICAgLy8gRm9yd2FyZCBhbGwgL3VwbG9hZHMgcmVxdWVzdHMgdG8gTmVzdEpTIHN0YXRpYyBmaWxlIHNlcnZlclxyXG4gICAgICBcIi91cGxvYWRzXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2UsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9aLFNBQVMsb0JBQW9CO0FBQ2piLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUE7QUFBQSxNQUdMLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFlBQVk7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
