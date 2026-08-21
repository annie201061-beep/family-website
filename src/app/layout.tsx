import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ouyang-Wu 家庭网站",
  description: "Our family website - Seattle, WA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
