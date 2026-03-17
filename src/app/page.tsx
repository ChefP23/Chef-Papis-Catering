import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  // Fetch this week's menu from Supabase
  const supabase = await createClient()
  const { data: cycles } = await supabase
    .from("menu_cycles")
    .select("*")
    .eq("status", "published")
    .order("delivery_date", { ascending: true })
    .limit(1)

  let menuPreview: { name: string; description: string; price: number; image: string; tag: string }[] = []

  if (cycles && cycles.length > 0) {
    const { data: items } = await supabase
      .from("menu_items")
      .select("*")
      .eq("cycle_id", cycles[0].id)
      .eq("is_available", true)
      .order("sort_order")
      .limit(3)

    if (items && items.length > 0) {
      menuPreview = items.map((item: any) => ({
        name: item.name,
        description: item.description || "",
        price: Number(item.price),
        image: item.name.toLowerCase().includes("alfredo") ? "/images/alfredo.jpg" : "/images/jerk-chicken.jpg",
        tag: item.school_district === "MCPS" ? "Montgomery County Public Schools" : item.school_district === "FCPS" ? "Frederick County Public Schools" : "All Districts",
      }))
    }
  }

  // Fallback menu if nothing is published in Supabase
  const displayMenu = menuPreview.length > 0 ? menuPreview : [
    { image: "/images/jerk-chicken.jpg", name: "Jerk Chicken Plate", tag: "Montgomery County Public Schools", description: "Slow-marinated jerk chicken, seasoned rice and beans, buttered cabbage, and candied yams.", price: 25 },
    { image: "/images/alfredo.jpg", name: "Chicken or Shrimp Alfredo", tag: "Frederick County Public Schools", description: "Creamy homemade alfredo sauce over fettuccine. Choose chicken, shrimp, or both.", price: 25 },
  ]

  const reviews = [
    { name: "Ms. Johnson", school: "Clarksburg HS", rating: 5, text: "The Jerk Chicken was incredible. Every Friday my whole department gathers around the food. Chef has ruined all other lunches for us!" },
    { name: "Mr. Williams", school: "Damascus HS", rating: 5, text: "Started a group order for our department and it was seamless. Everyone ordered separately, paid separately, food showed up hot and perfectly packed." },
    { name: "Principal Davis", school: "Northwest HS", rating: 5, text: "Used Chef for our end-of-year staff celebration. Restaurant quality, everything on time, price was beyond fair. Highly recommend." },
  ]
  return (
    <main style={{ background: "#FAF7F2", fontFamily: "var(--font-dm-sans)" }}>
      <header style={{ background: "rgba(250,247,242,0.95)", borderBottom: "1px solid rgba(196,154,43,0.2)", padding: "0 clamp(16px, 5vw, 64px)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, background: "#2D4A3E", border: "2px solid #C49A2B", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, color: "#E8B84B", letterSpacing: 1 }}>CP</div>
            <div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#2D4A3E", lineHeight: 1 }}>Chef Papi&apos;s</div>
              <div style={{ fontSize: 10, color: "#C49A2B", letterSpacing: 3, textTransform: "uppercase", fontWeight: 500 }}>Catering - Maryland</div>
            </div>
          </Link>
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="#services" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>What We Offer</a>
            <Link href="/about" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>About</Link>
            <a href="#gallery" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>Gallery</a>
            <a href="#reviews" style={{ padding: "8px 14px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: "#4A4A4A", textDecoration: "none" }}>Reviews</a>
            <Link href="/foodie-friday" style={{ padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", background: "#2D4A3E", marginLeft: 8 }}>Order Now</Link>
          </nav>
        </div>
      </header>
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/hero-bg.jpg)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(28,28,28,0.78) 0%, rgba(45,74,62,0.62) 50%, rgba(28,28,28,0.52) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "clamp(120px, 15vw, 160px) clamp(24px, 8vw, 120px) 80px", maxWidth: 900, textAlign: "center", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(196,154,43,0.2)", border: "1px solid rgba(196,154,43,0.5)", borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#E8B84B", marginBottom: 28 }}>
            Foodie Friday - Order Window Open
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(64px, 12vw, 140px)", color: "#fff", lineHeight: 0.92, letterSpacing: 1, marginBottom: 12 }}>
            Chef<br /><span style={{ color: "#E8B84B" }}>Papi&apos;s</span>
          </h1>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 26px)", color: "rgba(255,255,255,0.85)", marginBottom: 48, lineHeight: 1.5 }}>
            Fresh Ingredients. Bold Flavors. Mouthwatering Memories.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/foodie-friday" style={{ padding: "16px 36px", borderRadius: 8, background: "#C49A2B", color: "#1C1C1C", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Order This Friday</Link>
            <a href="#services" style={{ padding: "16px 36px", borderRadius: 8, background: "transparent", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", border: "2px solid rgba(255,255,255,0.5)" }}>What We Offer</a>
          </div>
        </div>
      </section>
      <div style={{ background: "#2D4A3E", padding: "24px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-around", gap: 32, flexWrap: "wrap" }}>
          {[{ num: "1,200+", label: "Meals Served", href: "" }, { num: "3 Counties", label: "MD Served", href: "" }, { num: "4.9 ★", label: "Avg Rating", href: "#reviews" }, { num: "Every Friday", label: "School Delivery", href: "" }].map(({ num, label, href }, i, arr) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {href ? (
                <a href={href} style={{ textAlign: "center", textDecoration: "none", cursor: "pointer" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "#E8B84B", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4, borderBottom: "1px dashed rgba(255,255,255,0.3)", paddingBottom: 2 }}>{label}</div>
                </a>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, color: "#E8B84B", lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              )}
              {i < arr.length - 1 && <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.15)" }} />}
            </div>
          ))}
        </div>
      </div>
      <section id="services" style={{ background: "#F5F0E8", padding: "100px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>What We Offer</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 56px)", color: "#2D4A3E", lineHeight: 1.1, marginBottom: 16 }}>More Ways to Eat Good</h2>
            <p style={{ fontSize: 16, color: "#4A4A4A", maxWidth: 480, lineHeight: 1.6, margin: "0 auto" }}>From weekly school deliveries to full event catering - restaurant-quality food, right to you.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { image: "/images/jerk-chicken.jpg", tag: "Weekly - Fridays", title: "Foodie Friday", desc: "Weekly lunch delivery to MCPS, FCPS, and Frederick County school staff. Order by Wednesday, delivered Friday 10AM-1PM.", link: "/foodie-friday", cta: "Order This Week" },
              { image: "/images/hero-bg.jpg", tag: "Events - Private", title: "Event Catering", desc: "School events, birthdays, and private celebrations across Montgomery, Frederick, and surrounding counties. Minimum $400.", link: "/catering", cta: "Request a Quote" },
              { image: "/images/gallery-3.jpg", tag: "Corporate - Teams - Clients", title: "Corporate Catering", desc: "Team lunches, client events, and recurring office catering. Custom menus, professional service, fair pricing.", link: "/corporate", cta: "Get a Quote" },
              { image: "/images/meal-prep.jpg", tag: "Weekly - Sunday Pickup", title: "Weekly Meal Prep", desc: "5 fresh meals every week. $100/week or save 25% with a 4-week commitment. Sunday pickup at 6PM.", link: "/meal-prep", cta: "Learn More" },
            ].map((s) => (
              <Link key={s.title} href={s.link} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "block", border: "1px solid rgba(45,74,62,0.12)" }}>
                <div style={{ height: 220, overflow: "hidden" }}>
                  <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#C49A2B", marginBottom: 10 }}>{s.tag}</div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 700, color: "#2D4A3E", marginBottom: 10 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.6, marginBottom: 20 }}>{s.desc}</div>
                  <div style={{ display: "inline-block", padding: "10px 24px", background: "#2D4A3E", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>{s.cta}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="about" style={{ background: "#2D4A3E", padding: "100px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#E8B84B", marginBottom: 16, textAlign: "center" }}>Our Story</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 24, textAlign: "center" }}>
              Food is Fuel. Your Body Deserves <em style={{ fontStyle: "italic", color: "#E8B84B" }}>the Best.</em>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.72)", marginBottom: 16, textAlign: "center" }}>
              Chef Papi&apos;s Catering was born from a simple belief - that the food we eat should nourish us just as much as it satisfies us. After years in the kitchen and a personal health journey that changed the way I see food, I made it my mission to bring bold, fresh, restaurant-quality meals to the communities that deserve it most.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.72)", marginBottom: 40, textAlign: "center" }}>
              Serving Maryland&apos;s school staff, families, and event guests across Montgomery County, Frederick County, and beyond.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "🌿", title: "Fresh Ingredients Always", desc: "No shortcuts. Every meal starts with quality ingredients, prepared fresh." },
                { icon: "🔥", title: "Bold, Honest Flavor", desc: "Inspired by Caribbean roots, Maryland culture, and years of perfecting every recipe." },
                { icon: "🤝", title: "Community First", desc: "Built for the teachers, staff, and families who keep Maryland communities running." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 44, height: 44, background: "rgba(196,154,43,0.18)", border: "1px solid rgba(196,154,43,0.3)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", height: 520 }}>
            <img src="/images/gallery-3.jpg" alt="Food" style={{ position: "absolute", top: 0, right: 0, width: "85%", height: 420, objectFit: "cover", borderRadius: 16, display: "block" }} />
            <img src="/images/gallery-2.jpg" alt="Food" style={{ position: "absolute", bottom: 0, left: 0, width: "60%", height: 280, objectFit: "cover", borderRadius: 16, border: "4px solid #2D4A3E", display: "block" }} />
            <div style={{ position: "absolute", bottom: 60, right: -16, background: "#C49A2B", color: "#1C1C1C", padding: "16px 20px", borderRadius: 12, textAlign: "center", fontWeight: 700, fontSize: 13, lineHeight: 1.3, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              Chef Marcus<br /><span style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>Founder and Head Chef</span>
            </div>
          </div>
        </div>
      </section>
      <section id="menu" style={{ background: "#FAF7F2", padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>This Week&apos;s Menu</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 48px)", color: "#2D4A3E", marginBottom: 16 }}>Foodie Friday</h2>
            <Link href="/foodie-friday" style={{ fontSize: 14, fontWeight: 600, color: "#2D4A3E", textDecoration: "none", borderBottom: "2px solid #C49A2B", paddingBottom: 2 }}>View Full Menu</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {displayMenu.map((item) => (
              <div key={item.name} style={{ background: "#fff", border: "1px solid rgba(45,74,62,0.12)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: 20, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, color: "#2D4A3E", marginBottom: 6 }}>{item.name}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "rgba(45,74,62,0.1)", color: "#2D4A3E" }}>{item.tag}</span>
                  <div style={{ fontSize: 13, color: "#7A7A7A", marginBottom: 16, lineHeight: 1.5, marginTop: 8 }}>{item.description}</div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
                    <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: "#2D4A3E" }}>${item.price.toFixed(2)}</div>
                    <Link href="/foodie-friday" style={{ padding: "8px 20px", background: "#2D4A3E", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Order Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "#7A7A7A", textAlign: "center" }}>Order cutoff: Wednesday 11:59 PM - Delivered Friday 10AM-1PM</div>
        </div>
      </section>
      <section id="gallery" style={{ background: "#F5F0E8", padding: "80px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>The Food</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 5vw, 56px)", color: "#2D4A3E" }}>Made Fresh. Every Time.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { src: "/images/gallery-1.jpg", span: 2, height: 320, caption: "Jerk Chicken Spread", sub: "School Staff Lunch" },
              { src: "/images/gallery-2.jpg", span: 1, height: 320, caption: "Shrimp Alfredo", sub: "Foodie Friday" },
              { src: "/images/gallery-3.jpg", span: 1, height: 320, caption: "Catering Setup", sub: "Frederick County Event" },
              { src: "/images/gallery-4.jpg", span: 1, height: 260, caption: "Rice and Beans", sub: "Caribbean Inspired" },
              { src: "/images/gallery-5.jpg", span: 1, height: 260, caption: "Meal Prep Packs", sub: "Weekly Meal Prep" },
              { src: "/images/gallery-6.jpg", span: 2, height: 260, caption: "Candied Yams and Sides", sub: "Staff Celebration" },
            ].map((img, i) => (
              <div key={i} style={{ gridColumn: `span ${img.span}`, height: img.height, borderRadius: 12, overflow: "hidden", position: "relative" }}>
                <img src={img.src} alt={img.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.6))" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{img.caption}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{img.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="catering" style={{ background: "#FAF7F2", padding: "100px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>Catering</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 4vw, 52px)", color: "#2D4A3E", marginBottom: 20 }}>We Bring the Party</h2>
            <p style={{ fontSize: 17, color: "#4A4A4A", lineHeight: 1.7, marginBottom: 36 }}>Chef handles school events, corporate lunches, private celebrations, and more across Brunswick, Montgomery County, Frederick County, and surrounding areas. Minimum $400. Secure your date with a 25% deposit.</p>
            <Link href="/catering" style={{ display: "inline-block", padding: "16px 36px", borderRadius: 10, background: "#2D4A3E", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Request a Quote</Link>
          </div>
          <div style={{ height: 400, borderRadius: 20, overflow: "hidden" }}>
            <img src="/images/gallery-1.jpg" alt="Catering" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>
      <div style={{ background: "#2D4A3E", padding: "24px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Serving:</div>
          {["MCPS - Montgomery County", "FCPS - Frederick County", "Brunswick City Schools", "Private and Corporate Events"].map(area => (
            <div key={area} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(196,154,43,0.25)", borderRadius: 100, fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#C49A2B", display: "inline-block" }}></span>
              {area}
            </div>
          ))}
        </div>
      </div>
      <section id="reviews" style={{ background: "#FAF7F2", padding: "100px clamp(16px, 5vw, 64px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: "#C49A2B", marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 4vw, 52px)", color: "#2D4A3E" }}>The Community Speaks</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {reviews.map((r) => (
              <div key={r.name} style={{ background: "#fff", border: "1px solid rgba(45,74,62,0.12)", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ color: "#C49A2B", fontSize: 18, marginBottom: 14 }}>{"★".repeat(r.rating)}</div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#1C1C1C", lineHeight: 1.65, marginBottom: 20 }}>&ldquo;{r.text}&rdquo;</p>
                <strong style={{ fontSize: 14, fontWeight: 600, color: "#2D4A3E", display: "block" }}>{r.name}</strong>
                <span style={{ fontSize: 12, color: "#7A7A7A" }}>{r.school}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#2D4A3E", textAlign: "center", padding: "100px clamp(16px, 5vw, 64px)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: "#E8B84B", marginBottom: 20 }}>Ready to Order?</div>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(40px, 8vw, 88px)", color: "#fff", lineHeight: 0.95, marginBottom: 36 }}>
          This Friday&apos;s <span style={{ color: "#E8B84B" }}>Menu is Open</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/foodie-friday" style={{ padding: "16px 36px", borderRadius: 8, background: "#C49A2B", color: "#1C1C1C", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>Order Foodie Friday</Link>
          <a href="/inquiry" style={{ padding: "16px 36px", borderRadius: 8, background: "transparent", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", border: "2px solid rgba(255,255,255,0.4)" }}>Book Catering</a>
        </div>
      </section>
      <footer style={{ background: "#1C1C1C", borderTop: "1px solid rgba(196,154,43,0.2)", padding: "60px clamp(16px, 5vw, 64px) 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, color: "#E8B84B", marginBottom: 12 }}>Chef Papi&apos;s Catering</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 16 }}>Community-focused catering and school lunch delivery serving MCPS, FCPS, Frederick County, and surrounding areas in Maryland.</p>
              <div style={{ fontSize: 13, color: "#C49A2B", marginBottom: 6 }}>hello@chefpapiscatering.com</div>
              <a href="tel:+13014483475" style={{ fontSize: 13, color: "#C49A2B", textDecoration: "none" }}>(301) 448-3475</a>
              <div style={{ display: "flex", gap: 12, marginTop: 16, justifyContent: "center" }}>
                <a href="https://instagram.com/chefpapiscatering" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }} aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="https://tiktok.com/@chefpapiscatering" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontSize: 16 }} aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.53a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.26 8.26 0 0 0 4.84 1.56V6.8a4.83 4.83 0 0 1-1.08-.11z"/></svg>
                </a>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Order</div>
              {[{ label: "Foodie Friday", href: "/foodie-friday" }, { label: "Catering", href: "/catering" }, { label: "Meal Prep", href: "/meal-prep" }, { label: "Corporate Catering", href: "/corporate" }].map((l) => (
                <div key={l.label} style={{ marginBottom: 10 }}><Link href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{l.label}</Link></div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>Legal</div>
              {[
                { label: "Terms and Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((l) => (
                <div key={l.label} style={{ marginBottom: 10 }}><Link href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{l.label}</Link></div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>2026 Chef Papi&apos;s Catering - Brunswick, MD</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Secure payments via Stripe - PCI Compliant</p>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.5, maxWidth: 600 }}>
              Allergen Notice: Prepared in a kitchen that handles shellfish, dairy, nuts, wheat, and soy. Please inform us of any allergies when placing your order.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}


