import type { Metadata } from "next";
import { Source_Serif_4, Noto_Sans_SC } from "next/font/google";
import { ThemeProvider } from "@/theme/ThemeContext";
import AntdProvider from "@/components/AntdProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { themes, DEFAULT_THEME } from "@/theme/themes";
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

// Generate minimal theme data for anti-flash inline script
const themeVarsJson = JSON.stringify(
  Object.fromEntries(
    Object.entries(themes).map(([k, v]) => [
      k,
      { cssVars: v.cssVars, fontStack: v.fontStack },
    ])
  )
);

const themeInitScript = `(function(){try{var T=${themeVarsJson};var k=localStorage.getItem('yiceng-theme')||'${DEFAULT_THEME}';var t=T[k]||T['${DEFAULT_THEME}'];var r=document.documentElement;r.setAttribute('data-theme',k);var v=t.cssVars;for(var p in v){r.style.setProperty(p,v[p])}r.style.setProperty('--font-body',t.fontStack==='serif'?'var(--font-serif)':'var(--font-sans)')}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${sourceSerif.variable} ${notoSansSC.variable} no-transition`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AntdProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AntdProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
