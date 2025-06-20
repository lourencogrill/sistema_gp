import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const providers: AuthOptions['providers'] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  }),
];

// Adiciona o provedor de credenciais apenas em ambiente de desenvolvimento
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      name: 'Development Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@company.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se o usuário for encontrado, retorna o objeto do usuário para o NextAuth
        // Em um provedor de credenciais real, você também verificaria a senha aqui
        if (user) {
          return user;
        }

        return null;
      },
    })
  );
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
}; 