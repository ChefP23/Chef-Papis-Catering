import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Chef Papi's | Our Story - Brunswick, MD Catering",
  description: "Chef Marcus built Chef Papi's Catering from a personal health journey and a passion for bold, fresh food. Serving Maryland school staff, families, and events.",
}

export default function About() {
  return (
    <main style={{ background: "#FAF7F2", fontFamily: "var(--font-dm-sans)" }}>
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
            <Link href="/#services" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>What We Offer</Link>
            <Link href="/#reviews" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>Reviews</Link>
            <Link href="/foodie-friday" style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", background: "#2D4A3E", marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>

      <section style={{ background: "#2D4A3E", padding: "80px clamp(16px, 5vw, 64px)", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#E8B84B", marginBottom: 16 }}>Our Story</div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(40px, 7vw, 72px)", color: "#fff", lineHeight: 1, marginBottom: 20 }}>
            Food is Fuel.<br /><span style={{ color: "#E8B84B" }}>Your Body Deserves the Best.</span>
          </h1>
        </div>
      </section>

      <section style={{ padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ height: 480, borderRadius: 20, overflow: "hidden" }}>
              <img src="/images/gallery-3.jpg" alt="Chef Marcus at work" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 40px)", color: "#2D4A3E", marginBottom: 20, lineHeight: 1.15 }}>Meet Chef Marcus</h2>
            <p style={{ fontSize: 16, color: "#4A4A4A", lineHeight: 1.8, marginBottom: 16 }}>
              Chef Papi&apos;s Catering was born from a simple belief — that the food we eat should nourish us just as much as it satisfies us.
            </p>
            <p style={{ fontSize: 16, color: "#4A4A4A", lineHeight: 1.8, marginBottom: 16 }}>
              After years in the kitchen and a personal health journey that changed the way I see food, I made it my mission to bring bold, fresh, restaurant-quality meals to the communities that deserve it most.
            </p>
            <p style={{ fontSize: 16, color: "#4A4A4A", lineHeight: 1.8, marginBottom: 16 }}>
              What started as cooking for friends and family in Brunswick, Maryland grew into Foodie Friday — a weekly lunch delivery program serving school staff across Montgomery County and Frederick County. Teachers, counselors, administrators — the people who pour into our communities every day — finally getting the kind of food they deserve on their lunch break.
            </p>
            <p style={{ fontSize: 16, color: "#4A4A4A", lineHeight: 1.8 }}>
              From there, the requests kept coming. Catering for school events. Corporate lunches. Birthdays. Celebrations. Weekly meal prep for busy families who still want to eat well. That&apos;s how Chef Papi&apos;s became what it is today — a full-service catering operation built on flavor, community, and doing right by the people I cook for.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#F5F0E8", padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>What We Stand For</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 44px)", color: "#2D4A3E" }}>Built Different</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              { icon: "🌿", title: "Fresh Ingredients Always", desc: "No shortcuts, no frozen reheats, no cutting corners. Every meal starts with quality ingredients, prepared fresh the day of. You can taste the difference." },
              { icon: "🔥", title: "Bold, Honest Flavor", desc: "Inspired by Caribbean roots, Maryland culture, and years of perfecting every recipe. This isn't generic catering food — it's food people actually look forward to." },
              { icon: "🤝", title: "Community First", desc: "Built for the teachers, counselors, administrators, and families who keep Maryland communities running. You show up for everyone else — let me show up for you." },
              { icon: "💪", title: "Food as Fuel", desc: "My own health journey taught me that what you eat matters. Every dish balances bold flavor with real nutrition. You should feel good after you eat, not just full." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(45,74,62,0.1)" }}>
                <div style={{ width: 52, height: 52, background: "rgba(196,154,43,0.15)", border: "1px solid rgba(196,154,43,0.25)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#2D4A3E", marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, color: "#7A7A7A", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#FAF7F2", padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>Where We Serve</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 44px)", color: "#2D4A3E" }}>Proudly Maryland</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { area: "Brunswick, MD", detail: "Home base — meal prep pickup location" },
              { area: "Montgomery County", detail: "MCPS school delivery + event catering" },
              { area: "Frederick County", detail: "FCPS school delivery + event catering" },
              { area: "Surrounding Areas", detail: "Corporate events + private celebrations" },
            ].map(({ area, detail }) => (
              <div key={area} style={{ background: "#2D4A3E", borderRadius: 16, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, color: "#E8B84B", marginBottom: 6 }}>{area}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#2D4A3E", textAlign: "center", padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#E8B84B", marginBottom: 20 }}>Let&apos;s Work Together</div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 52px)", color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>Ready to Taste the Difference?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 36 }}>Whether it&apos;s this Friday&apos;s lunch, your next event, or weekly meal prep — Chef has you covered.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/foodie-friday" style={{ padding: "16px 36px", borderRadius: 8, background: "#C49A2B", color: "#1C1C1C", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Order Foodie Friday</Link>
            <Link href="/catering" style={{ padding: "16px 36px", borderRadius: 8, background: "transparent", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", border: "2px solid rgba(255,255,255,0.4)" }}>Book Catering</Link>
          </div>
          <div style={{ marginTop: 24 }}>
            <a href="tel:+13014483475" style={{ fontSize: 15, color: "#E8B84B", textDecoration: "none", fontWeight: 600 }}>(301) 448-3475</a>
            <span style={{ color: "rgba(255,255,255,0.25)", margin: "0 12px" }}>|</span>
            <a href="mailto:hello@chefpapiscatering.com" style={{ fontSize: 15, color: "#E8B84B", textDecoration: "none", fontWeight: 600 }}>hello@chefpapiscatering.com</a>
          </div>
        </div>
      </section>

      <footer style={{ background: "#1C1C1C", padding: "40px clamp(16px, 5vw, 64px) 32px", borderTop: "1px solid rgba(196,154,43,0.2)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, color: "#E8B84B" }}>Chef Papi&apos;s Catering</div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="tel:+13014483475" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>(301) 448-3475</a>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>|</span>
            <Link href="/terms" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Terms</Link>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>|</span>
            <Link href="/privacy-policy" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Privacy</Link>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.15)" }}>|</span>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>2026 Chef Papi&apos;s - Brunswick, MD</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
