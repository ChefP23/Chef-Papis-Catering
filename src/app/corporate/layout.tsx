import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Corporate Catering | Chef Papi's - Maryland Office Catering",
  description: "Restaurant-quality corporate catering for Maryland businesses. Team lunches, client events, and recurring office catering. Custom menus, professional service, fair pricing.",
  openGraph: {
    title: "Corporate Catering | Chef Papi's",
    description: "Restaurant-quality corporate catering for Maryland businesses. From team lunches to client events.",
    url: "https://chefpapiscatering.com/corporate",
  },
}

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  return children
}
