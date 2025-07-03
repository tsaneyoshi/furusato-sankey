import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // globals.cssをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "R7 ふるさと納税 使い道 | 守谷市",
  description: "守谷市のふるさと納税がどのように使われているかをサンキー図で可視化します。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
