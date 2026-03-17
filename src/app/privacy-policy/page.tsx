import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Chef Papi's Catering",
  description: "Privacy policy for Chef Papi's Catering. Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicy() {
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
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 48px)", color: "#2D4A3E", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: "#7A7A7A", marginBottom: 48 }}>Last updated: March 2026</p>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>1. Information We Collect</h2>
            <p style={textStyle}>When you use Chef Papi&apos;s Catering services, we may collect the following information: your name, email address, phone number, school or workplace name, delivery address or event location, payment information (processed securely by Stripe — we do not store card numbers), order history, and dietary preferences or allergy information you provide.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>2. How We Use Your Information</h2>
            <p style={textStyle}>We use your personal information to process and fulfill your orders, communicate with you about your orders and account, send order confirmations and delivery updates (including SMS if you opt in), improve our menu and services, respond to your inquiries and catering requests, and comply with legal obligations.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>3. Payment Processing</h2>
            <p style={textStyle}>All payments are processed through Stripe, a PCI-DSS Level 1 compliant payment processor. Your payment card details are transmitted directly to Stripe and are never stored on our servers. For more information about how Stripe handles your data, please visit Stripe&apos;s privacy policy at stripe.com/privacy.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>4. SMS Communications</h2>
            <p style={textStyle}>If you opt in to SMS notifications during checkout, we will send you order confirmation and delivery update text messages. You can opt out at any time by replying STOP to any message. Message and data rates may apply. We will not use your phone number for marketing purposes unless you separately consent.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>5. Data Sharing</h2>
            <p style={textStyle}>We do not sell, trade, or rent your personal information to third parties. We may share your information with Stripe for payment processing, delivery partners as necessary to fulfill your order, and law enforcement if required by law. We do not share your information for advertising or marketing purposes with any third party.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>6. Data Storage and Security</h2>
            <p style={textStyle}>Your account and order data is stored securely using Supabase, which provides enterprise-grade security including encryption at rest and in transit. We implement reasonable security measures to protect your information, but no method of electronic storage is 100% secure.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>7. Cookies</h2>
            <p style={textStyle}>Our website uses essential cookies to maintain your session and remember your login status. We do not use third-party advertising or tracking cookies.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>8. Your Rights</h2>
            <p style={textStyle}>You may request access to the personal data we hold about you, ask us to correct or update inaccurate information, request deletion of your account and associated data, or opt out of SMS communications at any time. To exercise any of these rights, contact us at hello@chefpapiscatering.com.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>9. Children&apos;s Privacy</h2>
            <p style={textStyle}>Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>10. Changes to This Policy</h2>
            <p style={textStyle}>We may update this privacy policy from time to time. Changes will be posted on this page with a revised &ldquo;last updated&rdquo; date. We encourage you to review this page periodically.</p>
          </div>

          <div style={sectionStyle}>
            <h2 style={headingStyle}>11. Contact Us</h2>
            <p style={textStyle}>If you have questions about this privacy policy or how we handle your data, contact us at hello@chefpapiscatering.com or through the inquiry form on our website.</p>
          </div>
        </div>
      </section>

      <footer style={{ background: "#1C1C1C", padding: "40px clamp(16px, 5vw, 64px) 32px", borderTop: "1px solid rgba(196,154,43,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#E8B84B" }}>Chef Papi&apos;s Catering</div>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/terms" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms and Conditions</Link>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>|</span>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>2026 Chef Papi&apos;s - Brunswick, MD</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
