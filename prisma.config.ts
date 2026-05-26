import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // Vercel injects environment variables directly into process.env, 
    // so env() will pick them up automatically.
    url: env("DATABASE_URL"),
  },
});