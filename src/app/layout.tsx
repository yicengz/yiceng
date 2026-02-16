import type { Metadata } from "next";
import { Source_Serif_4, Noto_Sans_SC } from "next/font/google";
import AntdProvider from "@/components/AntdProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "一层 - 个人主页",
    template: "%s | 一层",
  },
  description: "一层的个人主页与博客，记录数据工程与生活的点滴",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${sourceSerif.variable} ${notoSansSC.variable}`}>
      <body>
        <AntdProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AntdProvider>
      </body>
    </html>
  );
}
