import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // Vercel handles the mapping of DATABASE_URL automatically
    url: process.env.DATABASE_URL as string,
  },
});