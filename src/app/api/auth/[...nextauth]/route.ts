import NextAuth from "next-auth";
import { authOptions } from "@/app/server/AuthOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
