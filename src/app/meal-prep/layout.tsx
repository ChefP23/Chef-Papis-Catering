import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Weekly Meal Prep | Chef Papi's - Brunswick, MD",
  description: "5 fresh, restaurant-quality meals every week. $100/week or save 25% with a 4-week commitment. Sunday pickup at 6PM in Brunswick, MD.",
  openGraph: {
    title: "Weekly Meal Prep | Chef Papi's",
    description: "5 fresh meals every week. Pick up Sunday at 6PM in Brunswick, MD and eat well all week long.",
    url: "https://chefpapiscatering.com/meal-prep",
  },
}

export default function MealPrepLayout({ children }: { children: React.ReactNode }) {
  return children
}
