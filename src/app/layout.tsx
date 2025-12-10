import type { Metadata, Viewport } from "next";

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7c3aed", // Violet-600 to match branding
};

export const metadata: Metadata = {
  title: {
    template: '%s | Coachweek',
    default: 'Coachweek | AI Cycling Coach',
  },
  description: "Free AI-powered cycling coach that analyzes your Strava data to create personalized weekly training plans. Improve your fitness with pyramidal or polarized training.",
  keywords: ["cycling", "coach", "AI", "Strava", "training plan", "polarized training", "pyramidal training", "fitness", "workout"],
  authors: [{ name: "Coachweek" }],
  creator: "Coachweek",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coachweek.app",
    title: "Coachweek | AI Cycling Coach",
    description: "Free AI-powered cycling coach that analyzes your Strava data to create personalized weekly training plans.",
    siteName: "Coachweek",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Coachweek Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coachweek | AI Cycling Coach",
    description: "Free AI-powered cycling coach that analyzes your Strava data to create personalized weekly training plans.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },

};

import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
