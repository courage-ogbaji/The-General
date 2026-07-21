import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { LucideProvider } from "lucide-react";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageTransition } from "@/components/page-transition";
import { GrainOverlay } from "@/components/grain-overlay";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The General",
  description: "A birthday celebration, from everyone who loves her.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const navUser = session?.user
    ? {
        displayName: session.user.name ?? session.user.email ?? "Wisher",
        profilePhotoUrl: session.user.image ?? null,
        role: session.user.role,
      }
    : null;

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <LucideProvider strokeWidth={1.5}>
          <GrainOverlay />
          <SiteHeader user={navUser} />
          <PageTransition>{children}</PageTransition>
          <SiteFooter />
          <Toaster position="bottom-center" />
        </LucideProvider>
      </body>
    </html>
  );
}
