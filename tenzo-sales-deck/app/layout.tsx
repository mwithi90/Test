import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tenzo Sales Deck Generator",
  description: "AI-powered sales presentation generator for Tenzo AEs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
