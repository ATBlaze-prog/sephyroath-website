// prisma.config.ts
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    // This loads the DATABASE_URL from your environment variables
    url: process.env.DATABASE_URL as string,
  },
});