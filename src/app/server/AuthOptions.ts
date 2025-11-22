import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import prisma from "@/utils/prisma";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // این تابع قلب منطق احراز هویت شماست
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("شماره موبایل و رمز عبور الزامی است.");
        }

        const user = await prisma.users.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user) {
          throw new Error("کاربری با این شماره موبایل یافت نشد.");
        }

        // ۲. رمز عبور وارد شده را با رمز عبور هش شده در دیتابیس مقایسه کن
        const passwordIsValid = await bcrypt.compare(
          credentials.password,
          user.password // ستون پسورد هش شده در دیتابیس
        );

        if (!passwordIsValid) {
          throw new Error("رمز عبور اشتباه است.");
        }

        // ۳. اگر همه چیز درست بود، آبجکت کاربر را برگردان
        // هر چیزی که اینجا برگردانده شود، در توکن JWT ذخیره خواهد شد
        return {
          id: user.id,
          name: user.fullName,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // آدرس صفحه لاگین شما
  },
  session: {
    strategy: "jwt", // استفاده از JSON Web Tokens برای مدیریت سشن
  },
  secret: process.env.NEXTAUTH_SECRET, // یک کلید امن برای رمزنگاری توکن‌ها
};
