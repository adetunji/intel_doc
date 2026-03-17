import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intel Doc",
  description: "Upload a PDF and chat with its contents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
