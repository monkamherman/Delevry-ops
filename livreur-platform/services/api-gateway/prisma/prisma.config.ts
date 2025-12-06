/// <reference types="node" />

import { PrismaConfig } from "@prisma/client";

const config: PrismaConfig = {
  datasources: {
    db: {
      url:
        process.env.DATABASE_URL ||
        "mongodb://localhost:27017/livreur-platform",
    },
  },
};

export default config;
