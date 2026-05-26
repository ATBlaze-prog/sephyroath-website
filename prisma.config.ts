import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // Vercel automatically maps your Environment Variables
    url: process.env.DATABASE_URL as string,
  },
});