import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VedaAI Assessment Creator",
  
  description: "Create AI assessments easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.className} ${bricolage.variable} bg-[#F3F4F6] text-gray-900 overflow-hidden print:overflow-visible print:h-auto h-screen print:block`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
