import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coach Dantas | Treinamento Funcional Inteligente em São Paulo — Mooca",
  description: "Treino funcional personalizado para surfistas, skatistas e atletas. 15 anos de experiência, 2 campeões mundiais. Agende sua avaliação gratuita na Mooca, SP.",
  keywords: "treinamento funcional mooca, personal trainer são paulo, treino para surfistas, preparação física atletas",
  openGraph: {
    title: "Coach Dantas | Treinamento Funcional Inteligente",
    description: "Treino funcional personalizado para surfistas, skatistas e atletas.",
    url: "https://coachdantas.com.br", // Replace with real URL later
    siteName: "Coach Dantas",
    locale: "pt_BR",
    type: "website",
  },
};

import { Header } from "@/components/ui/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-screen bg-brand-primary text-brand-secondary flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
