import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Event Catering | Chef Papi's - Brunswick, MD Catering",
  description: "Full-service event catering across Montgomery County, Frederick County, and Maryland. School events, birthdays, weddings, and private celebrations. Minimum $400.",
  openGraph: {
    title: "Event Catering | Chef Papi's",
    description: "Restaurant-quality catering for school events, birthdays, celebrations across Maryland.",
    url: "https://chefpapiscatering.com/catering",
  },
}

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return children
}
