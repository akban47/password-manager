import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              <header className="border-b">
                <div className="container mx-auto p-4">
                  <nav className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">
                      PassVault
                    </Link>
                    <Navigation />
                  </nav>
                </div>
              </header>
              <main className="container mx-auto py-6 px-4">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}