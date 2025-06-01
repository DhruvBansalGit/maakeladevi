import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'PremiumStone - Luxury Marble & Granite with 3D Visualization',
  description: 'Experience premium marble and granite like never before with our revolutionary 3D visualization technology. Browse, compare, and visualize your perfect stone selection.',
  keywords: 'marble, granite, 3D visualization, premium stone, luxury surfaces, granite visualization, stone selection',
  authors: [{ name: 'PremiumStone' }],
  openGraph: {
    title: 'PremiumStone - Luxury Marble & Granite with 3D Visualization',
    description: 'Experience premium marble and granite with revolutionary 3D visualization technology.',
    url: 'https://premiumstone.com',
    siteName: 'PremiumStone',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PremiumStone - Luxury Marble & Granite with 3D Visualization',
    description: 'Experience premium marble and granite with revolutionary 3D visualization technology.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
