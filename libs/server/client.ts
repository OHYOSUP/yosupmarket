import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
}

// global 안에 client가 없어서 ts오류가 뜨는데 declare해주면 됨
const client = global.client || new PrismaClient()
if (process.env.NODE_ENV === "development") global.client = client;


export default new PrismaClient();
