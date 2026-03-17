import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | Chef Papi's Catering",
  description: "Terms and conditions for Chef Papi's Catering services including Foodie Friday, event catering, and meal prep in Maryland.",
}

export default function Terms() {
  const sectionStyle = { marginBottom: 32 }
  const headingStyle = { fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700 as const, color: "#2D4A3E", marginBottom: 12 }
  const textStyle = { fontSize: 15, color: "#4A4A4A", lineHeight: 1.8, marginBottom: 12 }

  return (
    <main style={{ background: "#FAF7F2", fontFamily: "var(--font-dm-sans)", minHeight: "100vh" }}>
      <header style={{ background: "rgba(250,247,242,0.95)", borderBottom: "1px solid rgba(196,154,43,0.2)", padding: "0 clamp(16px, 5vw, 64px)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, background: "#2D4A3E", border: "2px solid #C49A2B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, color: "#E8B84B" }}>CP</div>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#2D4A3E", lineHeight: 1 }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: "#C49A2B", letterSpacing: 3, textTransform: "uppercase", fontWeight: 500 }}>Catering - Maryland</div>
            </div>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Link href="/" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>Home</Link>
            <Link href="/foodie-friday" style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", background: "#2D4A3E", marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>

      <section style={{ padding: "64px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 48px)", color: "#2D4A3E", marginBottom: 8 }}>Terms and Conditions</h1>
          <p style={{ fontSize: 14, color: "#7A7A7A", marginBottom: 48 }}>Last updated: March 2026</p>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>1. Overview</h2>
            <p style={textStyle}>These Terms and Conditions govern your use of the Chef Papi&apos;s Catering website (chefpapiscatering.com) and all food ordering, catering, and meal prep services provided by Chef Papi&apos;s Catering LLC, operating out of Brunswick, Maryland. By placing an order or using our services, you agree to these terms.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>2. Foodie Friday Orders</h2>
            <p style={textStyle}>Foodie Friday is a weekly lunch delivery service for school staff across Montgomery County Public Schools (MCPS) and Frederick County Public Schools (FCPS). Orders must be placed before the posted cutoff time (typically Wednesday at 11:59 PM). Orders placed after the cutoff cannot be guaranteed. All Foodie Friday orders are final once payment is processed. Deliveries occur on Fridays between 10:00 AM and 1:00 PM to the school main office.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>3. Event Catering</h2>
            <p style={textStyle}>Event catering requires a minimum order of $400. A 25% non-refundable deposit is required to secure your event date. The remaining balance is due no later than 48 hours before the event. Cancellations made more than 7 days before the event will receive a credit (minus the deposit) toward a future booking. Cancellations within 7 days of the event are non-refundable.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>4. Meal Prep Service</h2>
            <p style={textStyle}>Weekly meal prep is available at $100 per week (5 meals) or $300 for a 4-week commitment. Meals are available for Sunday pickup at 6:00 PM from our Brunswick, MD location. 4-week commitments are non-refundable once the first week&apos;s meals have been prepared. Weekly subscribers may cancel with at least 72 hours&apos; notice before the next prep cycle.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>5. Payments</h2>
            <p style={textStyle}>All payments are processed securely through Stripe. We accept major credit and debit cards. By providing payment information, you confirm that you are authorized to use the payment method. All prices listed on the website are in US dollars and include applicable fees unless otherwise stated.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>6. Allergen Disclaimer</h2>
            <p style={textStyle}>All food is prepared in a kitchen that handles shellfish, dairy, nuts, wheat, and soy. While we take precautions to prevent cross-contamination, we cannot guarantee an allergen-free environment. It is your responsibility to inform us of any food allergies or dietary restrictions when placing your order. Chef Papi&apos;s Catering is not liable for allergic reactions resulting from undisclosed allergies.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>7. Food Safety</h2>
            <p style={textStyle}>Chef Papi&apos;s Catering prepares all food in compliance with Maryland food safety regulations. All meals should be consumed promptly upon delivery. We are not responsible for food safety once the order has been delivered and accepted.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>8. Limitation of Liability</h2>
            <p style={textStyle}>Chef Papi&apos;s Catering LLC provides food services on an &ldquo;as-is&rdquo; basis. Our total liability for any claim arising from our services shall not exceed the amount you paid for the specific order in question. We are not liable for indirect, incidental, or consequential damages.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>9. Changes to Terms</h2>
            <p style={textStyle}>We may update these terms from time to time. Changes will be posted on this page with a revised &ldquo;last updated&rdquo; date. Continued use of our services after changes are posted constitutes acceptance of the updated terms.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>10. Contact</h2>
            <p style={textStyle}>For questions about these terms, contact us at hello@chefpapiscatering.com or through the inquiry form on our website.</p>
          </div>
        </div>
      </section>

      <footer style={{ background: "#1C1C1C", padding: "40px clamp(16px, 5vw, 64px) 32px", borderTop: "1px solid rgba(196,154,43,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#E8B84B" }}>Chef Papi&apos;s Catering</div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy-policy" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy Policy</Link>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>|</span>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>2026 Chef Papi&apos;s - Brunswick, MD</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
