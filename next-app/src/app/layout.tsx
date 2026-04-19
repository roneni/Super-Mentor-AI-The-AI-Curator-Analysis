import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Super-Mentor AI | The AI Curator & Strategy Engine",
  description: "Elite real-time strategic intelligence engine. Fuses the mental models of top product visionaries with live market data to curate, refine, and validate AI product ideas.",
  openGraph: {
    title: "Super-Mentor AI | The AI Curator",
    description: "Filter 99% of the noise. Surface the top 1% signals. Strategic intelligence powered by Cagan, Kim & Graham mental models.",
    type: "website",
    siteName: "Super-Mentor AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Super-Mentor AI | The AI Curator",
    description: "Filter 99% of the noise. Surface the top 1% signals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={inter.className}>
      <body className="min-h-screen bg-black text-white selection:bg-purple-500 overflow-x-hidden">
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/5 blur-[150px] rounded-full" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
