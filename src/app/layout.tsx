import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chef Papi's Catering | Foodie Friday MCPS School Lunch | Brunswick MD",
  description:
    "Weekly Foodie Friday lunch delivery to MCPS schools, event catering, and meal prep across Montgomery County, MD. Order by Wednesday, delivered Friday.",
  keywords: [
    "Brunswick catering",
    "MCPS school lunch",
    "Montgomery County food delivery",
    "Foodie Friday",
    "Maryland catering",
    "school staff lunch delivery",
  ],
  openGraph: {
    title: "Chef Papi's Catering",
    description:
      "Real food. Real community. Foodie Friday MCPS delivery + event catering.",
    url: "https://chefpapiscatering.com",
    siteName: "Chef Papi's Catering",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}