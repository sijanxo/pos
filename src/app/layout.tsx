import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Liquor Store POS",
  description: "Modern point-of-sale system for liquor stores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
