# Chef Papi's Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected `/admin` dashboard (9 sections) powered by live Supabase data, with sidebar navigation, paginated tables, filters, and targeted mutations (inquiry status, review approval).

**Architecture:** Next.js 16 App Router, nested routes under `/admin/*`. A server `layout.tsx` enforces `is_admin=true` via `customers` table. Data fetches happen in server components where possible; interactive tables (search/filter/pagination/mutations) are client components. Tailwind v4 for styling (dark sidebar, white content area). No new runtime packages.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, `@supabase/ssr` (existing `createClient` helpers at `@/lib/supabase/{client,server}`), Tailwind CSS v4, existing `date-fns`.

---

## Pre-flight Notes (read before starting)

1. **Existing admin page.** `src/app/admin/page.tsx` is a 392-line client component using a hardcoded `ADMIN_EMAIL` check and dark inline styles. This plan **replaces** it with a new structure. Delete it in Task 1 after the new layout is scaffolded.

2. **School association in orders.** The current `orders` row has both `school_id (uuid)` and `staff_name (text)`. Existing code treats `staff_name` as the school name string. The spec says "join to `schools`". We will **prefer `school_id` join** when present and fall back to `staff_name` string when `school_id` is null. This keeps existing orders functional while honoring the spec.

3. **`is_admin` check.** The `customers` table already has an `is_admin boolean` column (per schema). Make sure your own `customers` row has `is_admin = true` before testing. If not, run once in Supabase SQL: `update customers set is_admin = true where email = 'thechefmdllc@gmail.com';`

4. **Middleware.** `src/middleware.ts` already redirects unauthenticated users to `/login` for `/admin/*`. The new layout adds the authorization (`is_admin`) layer on top.

5. **No new packages.** Use plain HTML tables. Render the "revenue by week" chart as a simple sparkline-style bar chart built with div widths (Tailwind), not a chart library.

6. **Currency and dates.** Create `src/lib/admin/format.ts` once (Task 1). Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for money and a single `formatDateTime` helper for dates.

7. **Pagination.** All tables paginate client-side (simpler than wiring server pagination through search params for this internal tool, and 25/page against a few hundred rows is fine).

8. **Loading states.** Use `loading.tsx` files next to each `page.tsx` for a skeleton, plus inline skeletons in client tables while mutations run.

---

## File Structure

```
src/app/admin/
  layout.tsx              (NEW) server component: auth gate + shell with sidebar
  page.tsx                (REPLACE) Overview/Home — server component
  loading.tsx             (NEW) skeleton for overview
  orders/
    page.tsx              (NEW) server: initial orders fetch
    loading.tsx           (NEW)
  customers/
    page.tsx              (NEW) server: initial customers fetch
    loading.tsx           (NEW)
    [id]/page.tsx         (NEW) customer detail: orders + comms
  cycles/
    page.tsx              (NEW)
    loading.tsx           (NEW)
    [id]/page.tsx         (NEW) cycle detail
  schools/
    page.tsx              (NEW)
    loading.tsx           (NEW)
  catering/
    page.tsx              (NEW) merged inquiries + requests
    loading.tsx           (NEW)
  reviews/
    page.tsx              (NEW)
    loading.tsx           (NEW)
  waitlist/
    page.tsx              (NEW)
    loading.tsx           (NEW)
  comms/
    page.tsx              (NEW)
    loading.tsx           (NEW)

src/components/admin/
  AdminSidebar.tsx        (NEW) client: nav links + active state
  StatCard.tsx            (NEW) presentational
  WeekRevenueBars.tsx     (NEW) presentational bar chart
  DataTable.tsx           (NEW) client: reusable paginated table w/ search
  StatusBadge.tsx         (NEW)
  StarRating.tsx          (NEW) 5-star display
  OrdersClient.tsx        (NEW) client: orders table, filters, row expand
  CustomersClient.tsx     (NEW) client: customers table + search
  CyclesClient.tsx        (NEW)
  SchoolsClient.tsx       (NEW)
  CateringClient.tsx      (NEW) client: status mutation
  ReviewsClient.tsx       (NEW) client: approve/feature toggles
  WaitlistClient.tsx      (NEW)
  CommsClient.tsx         (NEW)

src/lib/admin/
  auth.ts                 (NEW) requireAdmin() server helper
  format.ts               (NEW) formatMoney, formatDateTime, formatDate
  queries.ts              (NEW) shared server-side Supabase query helpers

src/app/api/admin/
  inquiries/[id]/route.ts (NEW) PATCH: update inquiry status
  requests/[id]/route.ts  (NEW) PATCH: update catering_requests status
  reviews/[id]/route.ts   (NEW) PATCH: toggle is_approved / is_featured
```

---

### Task 1: Foundation — auth helper, format helpers, admin layout, sidebar

**Files:**
- Create: `src/lib/admin/auth.ts`
- Create: `src/lib/admin/format.ts`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/app/admin/layout.tsx`
- Delete (at end of task, after layout is in place): replace `src/app/admin/page.tsx` with minimal placeholder (Task 2 will fill it)

- [ ] **Step 1: Create `src/lib/admin/auth.ts`**

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export interface AdminContext {
  userId: string
  email: string
  customerId: string
  fullName: string | null
}

/**
 * Server-side guard. Call at the top of admin layout/pages/route handlers.
 * Redirects to `/login` if unauthenticated, `/` if authenticated but not admin.
 */
export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('id, full_name, is_admin')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!customer?.is_admin) {
    redirect('/')
  }

  return {
    userId: user.id,
    email: user.email ?? '',
    customerId: customer.id,
    fullName: customer.full_name,
  }
}
```

- [ ] **Step 2: Create `src/lib/admin/format.ts`**

```typescript
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMoney(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const n = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(n)) return '—'
  return usd.format(n)
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function nullish<T>(value: T | null | undefined, fallback = '—'): T | string {
  if (value === null || value === undefined || value === '') return fallback
  return value
}
```

- [ ] **Step 3: Create `src/components/admin/AdminSidebar.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV: { href: string; label: string }[] = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/cycles', label: 'Menu Cycles' },
  { href: '/admin/schools', label: 'Schools' },
  { href: '/admin/catering', label: 'Catering Inquiries' },
  { href: '/admin/reviews', label: 'Reviews' },
  { href: '/admin/waitlist', label: 'Waitlist' },
  { href: '/admin/comms', label: 'Comms Log' },
]

export function AdminSidebar({ adminName }: { adminName: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-neutral-900 text-neutral-100 min-h-screen flex flex-col">
      <div className="px-5 py-6 border-b border-neutral-800">
        <div className="text-sm uppercase tracking-widest text-neutral-400">Chef Papi's</div>
        <div className="text-lg font-semibold">Admin Dashboard</div>
        {adminName ? <div className="text-xs text-neutral-500 mt-1">{adminName}</div> : null}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname?.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'block px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white',
              ].join(' ')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-neutral-800 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-300">← Back to site</Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 4: Create `src/app/admin/layout.tsx`**

```typescript
import type { ReactNode } from 'react'
import { requireAdmin } from '@/lib/admin/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin()

  return (
    <div className="flex min-h-screen bg-white text-neutral-900">
      <AdminSidebar adminName={admin.fullName} />
      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Replace `src/app/admin/page.tsx` with a minimal placeholder**

The existing monolithic page will be fully replaced in Task 2, but it currently has `'use client'` and its own layout which will conflict with the new server layout. Replace the file contents with:

```typescript
export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="text-neutral-500 mt-2">Dashboard coming in Task 2.</p>
    </div>
  )
}
```

- [ ] **Step 6: Verify the admin shell loads**

Run: `npm run dev`

Manually verify:
1. Navigate to `http://localhost:3000/admin` while signed out → redirected to `/login` (middleware).
2. Sign in as a non-admin customer → redirected to `/`.
3. Sign in as the admin account → sees the sidebar on the left, "Overview" placeholder content on the right.
4. Click each sidebar link → navigates to `/admin/orders` etc. (they will 404 until Task 3+, that's expected).

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin src/components/admin/AdminSidebar.tsx src/app/admin/layout.tsx src/app/admin/page.tsx
git commit -m "feat(admin): add auth guard, format helpers, sidebar shell"
```

---

### Task 2: Overview (Home) — stat cards, week revenue, recent orders, open inquiries

**Files:**
- Create: `src/components/admin/StatCard.tsx`
- Create: `src/components/admin/WeekRevenueBars.tsx`
- Create: `src/components/admin/StatusBadge.tsx`
- Create: `src/app/admin/loading.tsx`
- Modify: `src/app/admin/page.tsx` (full overview implementation)

- [ ] **Step 1: Create `src/components/admin/StatCard.tsx`**

```typescript
interface StatCardProps {
  label: string
  value: string
  sublabel?: string
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-neutral-900">{value}</div>
      {sublabel ? <div className="mt-1 text-xs text-neutral-500">{sublabel}</div> : null}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/admin/StatusBadge.tsx`**

```typescript
const COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-800',
  delivered: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-neutral-200 text-neutral-700',
  new: 'bg-indigo-100 text-indigo-800',
  quoted: 'bg-amber-100 text-amber-800',
  booked: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-blue-100 text-blue-800',
  draft: 'bg-neutral-100 text-neutral-700',
  active: 'bg-green-100 text-green-800',
  closed: 'bg-neutral-200 text-neutral-700',
  sent: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const normalized = (status ?? 'unknown').toLowerCase()
  const cls = COLORS[normalized] ?? 'bg-neutral-100 text-neutral-700'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status ?? '—'}
    </span>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/WeekRevenueBars.tsx`**

```typescript
import { formatMoney } from '@/lib/admin/format'

export interface WeekBucket {
  label: string
  total: number
}

export function WeekRevenueBars({ weeks }: { weeks: WeekBucket[] }) {
  const max = Math.max(1, ...weeks.map((w) => w.total))

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-900">Revenue by week (last 8 weeks)</div>
      <div className="mt-4 space-y-2">
        {weeks.map((w) => (
          <div key={w.label} className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs text-neutral-500">{w.label}</div>
            <div className="flex-1 bg-neutral-100 rounded h-4 overflow-hidden">
              <div
                className="h-full bg-neutral-900"
                style={{ width: `${(w.total / max) * 100}%` }}
              />
            </div>
            <div className="w-24 shrink-0 text-right text-xs tabular-nums text-neutral-700">
              {formatMoney(w.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/app/admin/loading.tsx`**

```typescript
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-neutral-200" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-neutral-100" />
        ))}
      </div>
      <div className="h-64 rounded-lg bg-neutral-100" />
    </div>
  )
}
```

- [ ] **Step 5: Write the full overview page**

Replace `src/app/admin/page.tsx` entirely with:

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { WeekRevenueBars, type WeekBucket } from '@/components/admin/WeekRevenueBars'

export const dynamic = 'force-dynamic'

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const day = x.getDay() // 0 Sun .. 6 Sat
  x.setDate(x.getDate() - day)
  return x
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000).toISOString()

  const [paidAllRes, customersCountRes, recentOrdersRes, paidThisMonthRes, paidLastMonthRes, paidRecentRes, openInquiriesRes, openRequestsRes] = await Promise.all([
    supabase.from('orders').select('total', { count: 'exact' }).eq('status', 'paid'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, staff_name, customers(full_name, email), schools(name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('orders').select('total').eq('status', 'paid').gte('paid_at', thisMonthStart),
    supabase.from('orders').select('total').eq('status', 'paid').gte('paid_at', lastMonthStart).lt('paid_at', thisMonthStart),
    supabase.from('orders').select('total, paid_at').eq('status', 'paid').gte('paid_at', eightWeeksAgo),
    supabase
      .from('catering_inquiries')
      .select('id, contact_name, contact_email, event_date, event_type, status, created_at')
      .in('status', ['new', 'quoted'])
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('catering_requests')
      .select('id, full_name, email, event_date, event_type, status, created_at')
      .in('status', ['new', 'quoted'])
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const totalRevenue = (paidAllRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const totalOrdersCount = paidAllRes.count ?? 0
  const totalCustomers = customersCountRes.count ?? 0
  const revenueThisMonth = (paidThisMonthRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)
  const revenueLastMonth = (paidLastMonthRes.data ?? []).reduce((s, r) => s + Number(r.total ?? 0), 0)

  // Build 8 weekly buckets (oldest → newest)
  const buckets: WeekBucket[] = []
  const firstWeekStart = startOfWeek(new Date(eightWeeksAgo))
  for (let i = 0; i < 8; i++) {
    const start = new Date(firstWeekStart.getTime() + i * 7 * 24 * 60 * 60 * 1000)
    buckets.push({ label: weekLabel(start), total: 0 })
  }
  for (const row of paidRecentRes.data ?? []) {
    if (!row.paid_at) continue
    const paid = new Date(row.paid_at)
    const idx = Math.floor((paid.getTime() - firstWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
    if (idx >= 0 && idx < buckets.length) {
      buckets[idx].total += Number(row.total ?? 0)
    }
  }

  const openInquiries = [
    ...(openInquiriesRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_inquiries' as const,
      name: r.contact_name,
      email: r.contact_email,
      event_date: r.event_date,
      event_type: r.event_type,
      status: r.status,
      created_at: r.created_at,
    })),
    ...(openRequestsRes.data ?? []).map((r) => ({
      id: r.id,
      source: 'catering_requests' as const,
      name: r.full_name,
      email: r.email,
      event_date: r.event_date,
      event_type: r.event_type,
      status: r.status,
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total revenue" value={formatMoney(totalRevenue)} sublabel={`${totalOrdersCount} paid orders`} />
        <StatCard label="Total orders" value={String(totalOrdersCount)} />
        <StatCard label="Total customers" value={String(totalCustomers)} />
        <StatCard
          label="Revenue this month"
          value={formatMoney(revenueThisMonth)}
          sublabel={`Last month: ${formatMoney(revenueLastMonth)}`}
        />
      </div>

      <WeekRevenueBars weeks={buckets} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-neutral-500 hover:text-neutral-900">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="text-left py-2 font-medium">Order</th>
                <th className="text-left py-2 font-medium">Customer</th>
                <th className="text-left py-2 font-medium">School</th>
                <th className="text-right py-2 font-medium">Amount</th>
                <th className="text-right py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentOrdersRes.data ?? []).map((o: any) => (
                <tr key={o.id} className="border-t border-neutral-100">
                  <td className="py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                  <td className="py-2">{nullish(o.customers?.full_name ?? o.customers?.email)}</td>
                  <td className="py-2">{nullish(o.schools?.name ?? o.staff_name)}</td>
                  <td className="py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                  <td className="py-2 text-right"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
              {(recentOrdersRes.data ?? []).length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-neutral-500">No orders yet</td></tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium">Open catering inquiries</h2>
            <Link href="/admin/catering" className="text-xs text-neutral-500 hover:text-neutral-900">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Event</th>
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-right py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {openInquiries.map((i) => (
                <tr key={`${i.source}-${i.id}`} className="border-t border-neutral-100">
                  <td className="py-2">{nullish(i.name)}</td>
                  <td className="py-2">{nullish(i.event_type)}</td>
                  <td className="py-2">{formatDateTime(i.event_date)}</td>
                  <td className="py-2 text-right"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
              {openInquiries.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-neutral-500">No open inquiries</td></tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Verify**

Run `npm run dev` and navigate to `/admin`. Confirm:
- Four stat cards across the top with correct totals.
- Week-revenue bars render 8 weeks.
- Recent orders table shows up to 5 rows.
- Open inquiries merged from both tables shows up to 10 rows.
- Values render "—" instead of blank for null joins.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin src/app/admin/page.tsx src/app/admin/loading.tsx
git commit -m "feat(admin): overview page with stats, weekly revenue, recent orders, open inquiries"
```

---

### Task 3: Orders — searchable, filterable table + detail panel

**Files:**
- Create: `src/app/admin/orders/page.tsx` (server)
- Create: `src/app/admin/orders/loading.tsx`
- Create: `src/components/admin/OrdersClient.tsx` (client)

- [ ] **Step 1: Define the shared shape the client will consume**

No separate types file — inline the shape in `OrdersClient.tsx`. The server page passes orders and a schools list.

- [ ] **Step 2: Create `src/app/admin/orders/loading.tsx`**

```typescript
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-32 rounded bg-neutral-200" />
      <div className="h-12 rounded bg-neutral-100" />
      <div className="h-96 rounded-lg bg-neutral-100" />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/app/admin/orders/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { OrdersClient } from '@/components/admin/OrdersClient'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const [ordersRes, schoolsRes] = await Promise.all([
    supabase
      .from('orders')
      .select(
        'id, order_number, total, subtotal, status, paid_at, delivered_at, created_at, stripe_payment_intent_id, notes, staff_name, school_id, cycle_id, customer_phone, customers(id, full_name, email, phone), schools(id, name), order_items(id, item_name, item_price, quantity, for_staff_name)'
      )
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase.from('schools').select('id, name').order('name'),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <OrdersClient orders={ordersRes.data ?? []} schools={schoolsRes.data ?? []} />
    </div>
  )
}
```

- [ ] **Step 4: Create `src/components/admin/OrdersClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface OrderItem {
  id: string
  item_name: string
  item_price: number | string
  quantity: number
  for_staff_name: string | null
}

interface Order {
  id: string
  order_number: string | null
  total: number | string
  subtotal: number | string | null
  status: string
  paid_at: string | null
  delivered_at: string | null
  created_at: string
  stripe_payment_intent_id: string | null
  notes: string | null
  staff_name: string | null
  school_id: string | null
  cycle_id: string | null
  customer_phone: string | null
  customers: { id: string; full_name: string | null; email: string | null; phone: string | null } | null
  schools: { id: string; name: string } | null
  order_items: OrderItem[]
}

interface OrdersClientProps {
  orders: Order[]
  schools: { id: string; name: string }[]
}

const PAGE_SIZE = 25

export function OrdersClient({ orders, schools }: OrdersClientProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [schoolId, setSchoolId] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const statuses = useMemo(() => {
    return Array.from(new Set(orders.map((o) => o.status).filter(Boolean))).sort()
  }, [orders])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const from = dateFrom ? new Date(dateFrom).getTime() : null
    const to = dateTo ? new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1 : null

    return orders.filter((o) => {
      if (status !== 'all' && o.status !== status) return false
      if (schoolId !== 'all') {
        const ok = o.school_id === schoolId || o.schools?.id === schoolId
        if (!ok) return false
      }
      if (from !== null || to !== null) {
        const t = new Date(o.created_at).getTime()
        if (from !== null && t < from) return false
        if (to !== null && t > to) return false
      }
      if (q) {
        const hay = [
          o.order_number,
          o.customers?.full_name,
          o.customers?.email,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [orders, search, status, schoolId, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-64"
            placeholder="Order #, name, email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Status</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">School</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={schoolId}
            onChange={(e) => { setSchoolId(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">From</label>
          <input type="date" className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">To</label>
          <input type="date" className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} orders</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Order #</th>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">School</th>
              <th className="text-left px-4 py-3 font-medium">Items</th>
              <th className="text-right px-4 py-3 font-medium">Total</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Paid</th>
              <th className="text-left px-4 py-3 font-medium">Stripe</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => {
              const isOpen = expandedId === o.id
              const itemsSummary = (o.order_items ?? [])
                .map((i) => `${i.item_name} × ${i.quantity}`)
                .join(', ')
              return (
                <>
                  <tr
                    key={o.id}
                    className="border-t border-neutral-100 hover:bg-neutral-50 cursor-pointer"
                    onClick={() => setExpandedId(isOpen ? null : o.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div>{nullish(o.customers?.full_name)}</div>
                      <div className="text-xs text-neutral-500">{nullish(o.customers?.email)}</div>
                    </td>
                    <td className="px-4 py-3">{nullish(o.schools?.name ?? o.staff_name)}</td>
                    <td className="px-4 py-3 max-w-xs truncate text-neutral-700">{itemsSummary || '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatMoney(o.total)}</td>
                    <td className="px-4 py-3 text-right"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-xs text-neutral-600">{formatDateTime(o.paid_at)}</td>
                    <td className="px-4 py-3 text-xs">
                      {o.stripe_payment_intent_id ? (
                        <a
                          href={`https://dashboard.stripe.com/payments/${o.stripe_payment_intent_id}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : '—'}
                    </td>
                  </tr>
                  {isOpen ? (
                    <tr className="border-t border-neutral-100 bg-neutral-50">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Items</div>
                            <ul className="space-y-1">
                              {(o.order_items ?? []).map((i) => (
                                <li key={i.id} className="flex justify-between gap-2">
                                  <span>{i.item_name} × {i.quantity}{i.for_staff_name ? ` (for ${i.for_staff_name})` : ''}</span>
                                  <span className="tabular-nums">{formatMoney(Number(i.item_price) * i.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-2 pt-2 border-t border-neutral-200 flex justify-between text-xs text-neutral-600">
                              <span>Subtotal</span><span className="tabular-nums">{formatMoney(o.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium">
                              <span>Total</span><span className="tabular-nums">{formatMoney(o.total)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Customer</div>
                            <div>{nullish(o.customers?.full_name)}</div>
                            <div className="text-xs text-neutral-600">{nullish(o.customers?.email)}</div>
                            <div className="text-xs text-neutral-600">{nullish(o.customers?.phone ?? o.customer_phone)}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase text-neutral-500 mb-2">Delivery & notes</div>
                            <div className="text-xs">Delivered: {formatDateTime(o.delivered_at)}</div>
                            <div className="text-xs">Created: {formatDateTime(o.created_at)}</div>
                            <div className="text-xs mt-2 whitespace-pre-wrap">{o.notes ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              )
            })}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No orders match your filters</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPage={setPage} />
    </div>
  )
}

function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (n: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-neutral-600">Page {page} of {totalPages}</span>
      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Verify**

`npm run dev` → `/admin/orders`:
- Shows all orders, 25/page.
- Search across order number, customer name, email works.
- Status, school, date range filters narrow the list.
- Row click expands detail panel; second click collapses.
- Stripe link opens in new tab; clicking it does NOT expand the row.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/orders src/components/admin/OrdersClient.tsx
git commit -m "feat(admin): orders page with filters, search, pagination, detail panel"
```

---

### Task 4: Customers — searchable list + detail page

**Files:**
- Create: `src/app/admin/customers/page.tsx`
- Create: `src/app/admin/customers/loading.tsx`
- Create: `src/components/admin/CustomersClient.tsx`
- Create: `src/app/admin/customers/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/admin/customers/loading.tsx`**

```typescript
export default function Loading() {
  return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" />
}
```

- [ ] **Step 2: Create `src/app/admin/customers/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { CustomersClient } from '@/components/admin/CustomersClient'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  const [{ data: customers }, { data: orders }] = await Promise.all([
    supabase
      .from('customers')
      .select('id, full_name, email, phone, lifetime_spend, marketing_opt_in, is_admin, created_at')
      .order('created_at', { ascending: false })
      .limit(2000),
    supabase.from('orders').select('customer_id, created_at'),
  ])

  const stats = new Map<string, { count: number; lastOrderAt: string | null }>()
  for (const o of orders ?? []) {
    if (!o.customer_id) continue
    const cur = stats.get(o.customer_id) ?? { count: 0, lastOrderAt: null }
    cur.count += 1
    if (!cur.lastOrderAt || new Date(o.created_at).getTime() > new Date(cur.lastOrderAt).getTime()) {
      cur.lastOrderAt = o.created_at
    }
    stats.set(o.customer_id, cur)
  }

  const enriched = (customers ?? []).map((c) => ({
    ...c,
    total_orders: stats.get(c.id)?.count ?? 0,
    last_order_at: stats.get(c.id)?.lastOrderAt ?? null,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <CustomersClient customers={enriched} />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/CustomersClient.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'

interface CustomerRow {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  lifetime_spend: number | string | null
  marketing_opt_in: boolean | null
  is_admin: boolean | null
  created_at: string
  total_orders: number
  last_order_at: string | null
}

const PAGE_SIZE = 25

export function CustomersClient({ customers }: { customers: CustomerRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => {
      const hay = [c.full_name, c.email, c.phone].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [customers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, email, phone"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} customers</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-right px-4 py-3 font-medium">Lifetime spend</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-left px-4 py-3 font-medium">Last order</th>
              <th className="text-center px-4 py-3 font-medium">Opt-in</th>
              <th className="text-center px-4 py-3 font-medium">Admin</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${c.id}`} className="text-neutral-900 hover:underline">
                    {nullish(c.full_name)}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">{nullish(c.email)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(c.phone)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.lifetime_spend)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.total_orders}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(c.last_order_at)}</td>
                <td className="px-4 py-3 text-center">{c.marketing_opt_in ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">{c.is_admin ? '✓' : '—'}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No customers found</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/app/admin/customers/[id]/page.tsx`**

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: customer }, { data: orders }, { data: comms }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('comms_log')
      .select('id, channel, template, subject, status, sent_at')
      .eq('customer_id', id)
      .order('sent_at', { ascending: false }),
  ])

  if (!customer) {
    return (
      <div>
        <Link href="/admin/customers" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to customers</Link>
        <p className="mt-4 text-neutral-500">Customer not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/customers" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to customers</Link>
        <h1 className="mt-2 text-2xl font-semibold">{customer.full_name ?? customer.email}</h1>
        <div className="text-sm text-neutral-600 mt-1 space-x-3">
          <span>{nullish(customer.email)}</span>
          <span>{nullish(customer.phone)}</span>
          <span>Lifetime: {formatMoney(customer.lifetime_spend)}</span>
        </div>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Orders ({orders?.length ?? 0})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Order #</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
              <th className="text-right px-4 py-2 font-medium">Total</th>
              <th className="text-right px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{formatDateTime(o.created_at)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                <td className="px-4 py-2 text-right"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {(orders ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">No orders yet</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Communications ({comms?.length ?? 0})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Channel</th>
              <th className="text-left px-4 py-2 font-medium">Template</th>
              <th className="text-left px-4 py-2 font-medium">Subject</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {(comms ?? []).map((c) => (
              <tr key={c.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{nullish(c.channel)}</td>
                <td className="px-4 py-2 text-neutral-600">{nullish(c.template)}</td>
                <td className="px-4 py-2">{nullish(c.subject)}</td>
                <td className="px-4 py-2"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-2 text-xs">{formatDateTime(c.sent_at)}</td>
              </tr>
            ))}
            {(comms ?? []).length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-neutral-500">No comms logged</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Verify**

`/admin/customers` — list loads, search works, pagination works, names link to detail pages. `/admin/customers/{id}` shows orders and comms for that customer.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/customers src/components/admin/CustomersClient.tsx
git commit -m "feat(admin): customers list + detail with orders and comms"
```

---

### Task 5: Menu Cycles — list + detail with items and orders

**Files:**
- Create: `src/app/admin/cycles/page.tsx`
- Create: `src/app/admin/cycles/loading.tsx`
- Create: `src/app/admin/cycles/[id]/page.tsx`
- Create: `src/components/admin/CyclesClient.tsx`

- [ ] **Step 1: Create `src/app/admin/cycles/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 2: Create `src/app/admin/cycles/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { CyclesClient } from '@/components/admin/CyclesClient'

export const dynamic = 'force-dynamic'

export default async function AdminCyclesPage() {
  const supabase = await createClient()

  const [{ data: cycles }, { data: orders }] = await Promise.all([
    supabase
      .from('menu_cycles')
      .select('id, title, delivery_date, cutoff_datetime, status, order_cap, school_cap, is_mcps_only, notes, created_at')
      .order('delivery_date', { ascending: false }),
    supabase.from('orders').select('cycle_id, total, status'),
  ])

  const stats = new Map<string, { count: number; revenue: number }>()
  for (const o of orders ?? []) {
    if (!o.cycle_id) continue
    const cur = stats.get(o.cycle_id) ?? { count: 0, revenue: 0 }
    cur.count += 1
    if (o.status === 'paid' || o.status === 'delivered') cur.revenue += Number(o.total ?? 0)
    stats.set(o.cycle_id, cur)
  }

  const enriched = (cycles ?? []).map((c) => ({
    ...c,
    total_orders: stats.get(c.id)?.count ?? 0,
    total_revenue: stats.get(c.id)?.revenue ?? 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Menu cycles</h1>
      <CyclesClient cycles={enriched} />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/CyclesClient.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, formatMoney } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface CycleRow {
  id: string
  title: string | null
  delivery_date: string | null
  cutoff_datetime: string | null
  status: string | null
  order_cap: number | null
  school_cap: number | null
  is_mcps_only: boolean | null
  notes: string | null
  total_orders: number
  total_revenue: number
}

const PAGE_SIZE = 25

export function CyclesClient({ cycles }: { cycles: CycleRow[] }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(cycles.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = useMemo(() => cycles.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), [cycles, current])

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Delivery</th>
              <th className="text-left px-4 py-3 font-medium">Cutoff</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Order cap</th>
              <th className="text-right px-4 py-3 font-medium">School cap</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-right px-4 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => (
              <tr key={c.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/cycles/${c.id}`} className="hover:underline">{c.title ?? '—'}</Link>
                </td>
                <td className="px-4 py-3">{formatDate(c.delivery_date)}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(c.cutoff_datetime)}</td>
                <td className="px-4 py-3 text-right"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-right tabular-nums">{c.order_cap ?? '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.school_cap ?? '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{c.total_orders}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(c.total_revenue)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No cycles</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Create `src/app/admin/cycles/[id]/page.tsx`**

```typescript
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatDateTime, formatMoney, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function CycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: cycle }, { data: items }, { data: orders }] = await Promise.all([
    supabase.from('menu_cycles').select('*').eq('id', id).maybeSingle(),
    supabase
      .from('menu_items')
      .select('id, name, description, price, cost, is_available, sort_order, allergens')
      .eq('cycle_id', id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, customers(full_name, email), schools(name), staff_name')
      .eq('cycle_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!cycle) {
    return (
      <div>
        <Link href="/admin/cycles" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to cycles</Link>
        <p className="mt-4 text-neutral-500">Cycle not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/cycles" className="text-sm text-neutral-500 hover:text-neutral-900">← Back to cycles</Link>
        <h1 className="mt-2 text-2xl font-semibold">{cycle.title}</h1>
        <div className="text-sm text-neutral-600 mt-1 space-x-3">
          <span>Delivery: {formatDate(cycle.delivery_date)}</span>
          <span>Cutoff: {formatDateTime(cycle.cutoff_datetime)}</span>
          <StatusBadge status={cycle.status} />
        </div>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Menu items ({items?.length ?? 0})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-right px-4 py-2 font-medium">Price</th>
              <th className="text-right px-4 py-2 font-medium">Cost</th>
              <th className="text-center px-4 py-2 font-medium">Available</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((i) => (
              <tr key={i.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{i.name}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(i.price)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(i.cost)}</td>
                <td className="px-4 py-2 text-center">{i.is_available ? '✓' : '—'}</td>
              </tr>
            ))}
            {(items ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-neutral-500">No items</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-3 border-b border-neutral-200 text-sm font-medium">Orders ({orders?.length ?? 0})</div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Order #</th>
              <th className="text-left px-4 py-2 font-medium">Customer</th>
              <th className="text-left px-4 py-2 font-medium">School</th>
              <th className="text-right px-4 py-2 font-medium">Total</th>
              <th className="text-right px-4 py-2 font-medium">Status</th>
              <th className="text-left px-4 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o: any) => (
              <tr key={o.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 font-mono text-xs">{o.order_number ?? o.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{nullish(o.customers?.full_name ?? o.customers?.email)}</td>
                <td className="px-4 py-2">{nullish(o.schools?.name ?? o.staff_name)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatMoney(o.total)}</td>
                <td className="px-4 py-2 text-right"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-2 text-xs">{formatDateTime(o.created_at)}</td>
              </tr>
            ))}
            {(orders ?? []).length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-neutral-500">No orders</td></tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  )
}
```

- [ ] **Step 5: Verify**

`/admin/cycles` — each row shows order count and paid revenue. Click a title → detail page with menu items and orders.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/cycles src/components/admin/CyclesClient.tsx
git commit -m "feat(admin): menu cycles list + detail with items and orders"
```

---

### Task 6: Schools — list with order count and revenue

**Files:**
- Create: `src/app/admin/schools/page.tsx`
- Create: `src/app/admin/schools/loading.tsx`
- Create: `src/components/admin/SchoolsClient.tsx`

- [ ] **Step 1: Create `src/app/admin/schools/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 2: Create `src/app/admin/schools/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { SchoolsClient } from '@/components/admin/SchoolsClient'

export const dynamic = 'force-dynamic'

export default async function AdminSchoolsPage() {
  const supabase = await createClient()

  const [{ data: schools }, { data: orders }] = await Promise.all([
    supabase.from('schools').select('id, name, district, address, is_active, created_at').order('name'),
    supabase.from('orders').select('school_id, total, status'),
  ])

  const stats = new Map<string, { count: number; revenue: number }>()
  for (const o of orders ?? []) {
    if (!o.school_id) continue
    const cur = stats.get(o.school_id) ?? { count: 0, revenue: 0 }
    cur.count += 1
    if (o.status === 'paid' || o.status === 'delivered') cur.revenue += Number(o.total ?? 0)
    stats.set(o.school_id, cur)
  }

  const enriched = (schools ?? []).map((s) => ({
    ...s,
    total_orders: stats.get(s.id)?.count ?? 0,
    total_revenue: stats.get(s.id)?.revenue ?? 0,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Schools</h1>
      <SchoolsClient schools={enriched} />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/SchoolsClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatMoney, nullish } from '@/lib/admin/format'

interface SchoolRow {
  id: string
  name: string
  district: string | null
  address: string | null
  is_active: boolean | null
  total_orders: number
  total_revenue: number
}

const PAGE_SIZE = 25

export function SchoolsClient({ schools }: { schools: SchoolRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return schools
    return schools.filter((s) => {
      const hay = [s.name, s.district, s.address].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [schools, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, district, address"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} schools</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">District</th>
              <th className="text-left px-4 py-3 font-medium">Address</th>
              <th className="text-center px-4 py-3 font-medium">Active</th>
              <th className="text-right px-4 py-3 font-medium">Orders</th>
              <th className="text-right px-4 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(s.district)}</td>
                <td className="px-4 py-3 text-neutral-700 text-xs">{nullish(s.address)}</td>
                <td className="px-4 py-3 text-center">{s.is_active ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{s.total_orders}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatMoney(s.total_revenue)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No schools found</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Verify**

`/admin/schools` — list with search, order counts + revenue per school.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/schools src/components/admin/SchoolsClient.tsx
git commit -m "feat(admin): schools page with per-school order stats"
```

---

### Task 7: Catering Inquiries — merged view + status mutation

**Files:**
- Create: `src/app/api/admin/inquiries/[id]/route.ts`
- Create: `src/app/api/admin/requests/[id]/route.ts`
- Create: `src/app/admin/catering/page.tsx`
- Create: `src/app/admin/catering/loading.tsx`
- Create: `src/components/admin/CateringClient.tsx`

- [ ] **Step 1: Create `src/app/api/admin/inquiries/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'

const bodySchema = z.object({
  status: z.enum(['new', 'quoted', 'booked', 'completed', 'cancelled']),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await context.params
  const json = await request.json().catch(() => null)
  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('catering_inquiries')
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Create `src/app/api/admin/requests/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'

const bodySchema = z.object({
  status: z.enum(['new', 'quoted', 'booked', 'completed', 'cancelled']),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await context.params
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('catering_requests')
    .update({ status: parsed.data.status })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create `src/app/admin/catering/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 4: Create `src/app/admin/catering/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { CateringClient, type CateringRow } from '@/components/admin/CateringClient'

export const dynamic = 'force-dynamic'

export default async function AdminCateringPage() {
  const supabase = await createClient()

  const [{ data: inquiries }, { data: requests }] = await Promise.all([
    supabase
      .from('catering_inquiries')
      .select('id, contact_name, contact_email, contact_phone, event_type, event_date, guest_count, budget_range, status, quote_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
    supabase
      .from('catering_requests')
      .select('id, full_name, email, phone, event_type, event_date, guest_count, budget, status, created_at')
      .order('created_at', { ascending: false })
      .limit(1000),
  ])

  const rows: CateringRow[] = [
    ...(inquiries ?? []).map((r) => ({
      id: r.id,
      source: 'catering_inquiries' as const,
      name: r.contact_name,
      email: r.contact_email,
      phone: r.contact_phone,
      event_type: r.event_type,
      event_date: r.event_date,
      guest_count: r.guest_count,
      budget: r.budget_range,
      status: r.status ?? 'new',
      quote_amount: r.quote_amount,
      created_at: r.created_at,
    })),
    ...(requests ?? []).map((r) => ({
      id: r.id,
      source: 'catering_requests' as const,
      name: r.full_name,
      email: r.email,
      phone: r.phone,
      event_type: r.event_type,
      event_date: r.event_date,
      guest_count: r.guest_count,
      budget: r.budget,
      status: r.status ?? 'new',
      quote_amount: null,
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Catering inquiries</h1>
      <CateringClient rows={rows} />
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/admin/CateringClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, formatMoney, nullish } from '@/lib/admin/format'

export interface CateringRow {
  id: string
  source: 'catering_inquiries' | 'catering_requests'
  name: string | null
  email: string | null
  phone: string | null
  event_type: string | null
  event_date: string | null
  guest_count: number | null
  budget: string | null
  status: string
  quote_amount: number | string | null
  created_at: string
}

const STATUS_OPTIONS = ['new', 'quoted', 'booked', 'completed', 'cancelled'] as const
const PAGE_SIZE = 25

export function CateringClient({ rows }: { rows: CateringRow[] }) {
  const [items, setItems] = useState(rows)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [savingId, setSavingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (q) {
        const hay = [r.name, r.email, r.phone, r.event_type].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  async function updateStatus(row: CateringRow, next: string) {
    setSavingId(row.id)
    const endpoint = row.source === 'catering_inquiries'
      ? `/api/admin/inquiries/${row.id}`
      : `/api/admin/requests/${row.id}`
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        alert(`Failed to update: ${body.error ?? res.statusText}`)
        return
      }
      setItems((prev) => prev.map((r) => r.id === row.id && r.source === row.source ? { ...r, status: next } : r))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, email, phone, event type"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Status</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} inquiries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Contact</th>
              <th className="text-left px-4 py-3 font-medium">Event</th>
              <th className="text-left px-4 py-3 font-medium">Event date</th>
              <th className="text-right px-4 py-3 font-medium">Guests</th>
              <th className="text-left px-4 py-3 font-medium">Budget</th>
              <th className="text-right px-4 py-3 font-medium">Quote</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={`${r.source}-${r.id}`} className="border-t border-neutral-100">
                <td className="px-4 py-3">{nullish(r.name)}</td>
                <td className="px-4 py-3 text-xs">
                  <div>{nullish(r.email)}</div>
                  <div className="text-neutral-500">{nullish(r.phone)}</div>
                </td>
                <td className="px-4 py-3">{nullish(r.event_type)}</td>
                <td className="px-4 py-3">{formatDate(r.event_date)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.guest_count ?? '—'}</td>
                <td className="px-4 py-3">{nullish(r.budget)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {r.quote_amount !== null && r.quote_amount !== undefined ? formatMoney(r.quote_amount) : '—'}
                </td>
                <td className="px-4 py-3">
                  <select
                    disabled={savingId === r.id}
                    value={r.status}
                    onChange={(e) => updateStatus(r, e.target.value)}
                    className="border border-neutral-300 rounded px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-neutral-500">No inquiries found</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 6: Verify**

`/admin/catering` — merged list of both tables, sorted newest first. Changing the status dropdown persists (refresh page → status sticks). Try invalid status via dev tools → API returns 400. Sign out → API returns redirect (requireAdmin).

- [ ] **Step 7: Commit**

```bash
git add src/app/api/admin/inquiries src/app/api/admin/requests src/app/admin/catering src/components/admin/CateringClient.tsx
git commit -m "feat(admin): catering inquiries merged view with status mutation"
```

---

### Task 8: Reviews — list + approve/feature toggles

**Files:**
- Create: `src/app/api/admin/reviews/[id]/route.ts`
- Create: `src/app/admin/reviews/page.tsx`
- Create: `src/app/admin/reviews/loading.tsx`
- Create: `src/components/admin/StarRating.tsx`
- Create: `src/components/admin/ReviewsClient.tsx`

- [ ] **Step 1: Create `src/components/admin/StarRating.tsx`**

```typescript
export function StarRating({ rating }: { rating: number | null | undefined }) {
  const n = Math.max(0, Math.min(5, rating ?? 0))
  return (
    <span className="text-amber-500" aria-label={`${n} out of 5`}>
      {'★'.repeat(n)}
      <span className="text-neutral-300">{'★'.repeat(5 - n)}</span>
    </span>
  )
}
```

- [ ] **Step 2: Create `src/app/api/admin/reviews/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'

const bodySchema = z.object({
  is_approved: z.boolean().optional(),
  is_featured: z.boolean().optional(),
})

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await requireAdmin()
  const { id } = await context.params
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success || (parsed.data.is_approved === undefined && parsed.data.is_featured === undefined)) {
    return NextResponse.json({ error: 'Provide is_approved and/or is_featured' }, { status: 400 })
  }

  const update: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.is_approved === true) update.approved_at = new Date().toISOString()
  if (parsed.data.is_approved === false) update.approved_at = null

  const supabase = await createClient()
  const { error } = await supabase.from('reviews').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create `src/app/admin/reviews/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 4: Create `src/app/admin/reviews/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { ReviewsClient } from '@/components/admin/ReviewsClient'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, title, body, service_type, is_verified, is_approved, is_featured, created_at, customers(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(1000)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Reviews</h1>
      <ReviewsClient reviews={(data ?? []) as any} />
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/admin/ReviewsClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatDateTime, nullish } from '@/lib/admin/format'
import { StarRating } from '@/components/admin/StarRating'

interface ReviewRow {
  id: string
  rating: number | null
  title: string | null
  body: string | null
  service_type: string | null
  is_verified: boolean | null
  is_approved: boolean | null
  is_featured: boolean | null
  created_at: string
  customers: { full_name: string | null; email: string | null } | null
}

const PAGE_SIZE = 25

export function ReviewsClient({ reviews }: { reviews: ReviewRow[] }) {
  const [items, setItems] = useState(reviews)
  const [page, setPage] = useState(1)
  const [savingId, setSavingId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = useMemo(() => items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), [items, current])

  async function toggle(reviewId: string, field: 'is_approved' | 'is_featured', next: boolean) {
    setSavingId(reviewId)
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: next }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        alert(`Failed to update: ${body.error ?? res.statusText}`)
        return
      }
      setItems((prev) => prev.map((r) => r.id === reviewId ? { ...r, [field]: next } : r))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Rating</th>
              <th className="text-left px-4 py-3 font-medium">Title / body</th>
              <th className="text-left px-4 py-3 font-medium">Service</th>
              <th className="text-center px-4 py-3 font-medium">Verified</th>
              <th className="text-center px-4 py-3 font-medium">Approved</th>
              <th className="text-center px-4 py-3 font-medium">Featured</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3">
                  <div>{nullish(r.customers?.full_name)}</div>
                  <div className="text-xs text-neutral-500">{nullish(r.customers?.email)}</div>
                </td>
                <td className="px-4 py-3"><StarRating rating={r.rating} /></td>
                <td className="px-4 py-3 max-w-md">
                  <div className="font-medium">{nullish(r.title)}</div>
                  <div className="text-xs text-neutral-600 line-clamp-2">{nullish(r.body)}</div>
                </td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.service_type)}</td>
                <td className="px-4 py-3 text-center">{r.is_verified ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      disabled={savingId === r.id}
                      checked={!!r.is_approved}
                      onChange={(e) => toggle(r.id, 'is_approved', e.target.checked)}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-center">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      disabled={savingId === r.id}
                      checked={!!r.is_featured}
                      onChange={(e) => toggle(r.id, 'is_featured', e.target.checked)}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-500">No reviews yet</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 6: Verify**

`/admin/reviews` — stars render, checkbox toggles persist. Refresh → state sticks.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/admin/reviews src/app/admin/reviews src/components/admin/StarRating.tsx src/components/admin/ReviewsClient.tsx
git commit -m "feat(admin): reviews page with approve/feature toggles"
```

---

### Task 9: Waitlist — list with cycle + school joins

**Files:**
- Create: `src/app/admin/waitlist/page.tsx`
- Create: `src/app/admin/waitlist/loading.tsx`
- Create: `src/components/admin/WaitlistClient.tsx`

- [ ] **Step 1: Create `src/app/admin/waitlist/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 2: Create `src/app/admin/waitlist/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { WaitlistClient } from '@/components/admin/WaitlistClient'

export const dynamic = 'force-dynamic'

export default async function AdminWaitlistPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('waitlist')
    .select('id, name, email, phone, position, notified_spot_open, notified_next_cycle, created_at, schools(name), menu_cycles(title, delivery_date)')
    .order('created_at', { ascending: false })
    .limit(1000)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Waitlist</h1>
      <WaitlistClient rows={(data ?? []) as any} />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/WaitlistClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatDate, formatDateTime, nullish } from '@/lib/admin/format'

interface WaitlistRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  position: number | null
  notified_spot_open: boolean | null
  notified_next_cycle: boolean | null
  created_at: string
  schools: { name: string } | null
  menu_cycles: { title: string | null; delivery_date: string | null } | null
}

const PAGE_SIZE = 25

export function WaitlistClient({ rows }: { rows: WaitlistRow[] }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const hay = [r.name, r.email, r.phone, r.schools?.name, r.menu_cycles?.title].filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [rows, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Search</label>
          <input
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm w-72"
            placeholder="Name, email, school, cycle"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} entries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">School</th>
              <th className="text-left px-4 py-3 font-medium">Cycle</th>
              <th className="text-right px-4 py-3 font-medium">Position</th>
              <th className="text-center px-4 py-3 font-medium">Spot open</th>
              <th className="text-center px-4 py-3 font-medium">Next cycle</th>
              <th className="text-left px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">{nullish(r.name)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.email)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.phone)}</td>
                <td className="px-4 py-3">{nullish(r.schools?.name)}</td>
                <td className="px-4 py-3">
                  <div>{nullish(r.menu_cycles?.title)}</div>
                  <div className="text-xs text-neutral-500">{formatDate(r.menu_cycles?.delivery_date)}</div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{r.position ?? '—'}</td>
                <td className="px-4 py-3 text-center">{r.notified_spot_open ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-center">{r.notified_next_cycle ? '✓' : '—'}</td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.created_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-neutral-500">No waitlist entries</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Verify**

`/admin/waitlist` — list with joins, search, pagination.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/waitlist src/components/admin/WaitlistClient.tsx
git commit -m "feat(admin): waitlist page with school and cycle joins"
```

---

### Task 10: Comms Log — list with channel + status filters

**Files:**
- Create: `src/app/admin/comms/page.tsx`
- Create: `src/app/admin/comms/loading.tsx`
- Create: `src/components/admin/CommsClient.tsx`

- [ ] **Step 1: Create `src/app/admin/comms/loading.tsx`**

```typescript
export default function Loading() { return <div className="h-96 rounded-lg bg-neutral-100 animate-pulse" /> }
```

- [ ] **Step 2: Create `src/app/admin/comms/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { CommsClient } from '@/components/admin/CommsClient'

export const dynamic = 'force-dynamic'

export default async function AdminCommsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('comms_log')
    .select('id, channel, template, to_address, subject, status, sent_at, customers(full_name, email)')
    .order('sent_at', { ascending: false, nullsFirst: false })
    .limit(2000)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Comms log</h1>
      <CommsClient rows={(data ?? []) as any} />
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/admin/CommsClient.tsx`**

```typescript
'use client'

import { useMemo, useState } from 'react'
import { formatDateTime, nullish } from '@/lib/admin/format'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface CommsRow {
  id: string
  channel: string | null
  template: string | null
  to_address: string | null
  subject: string | null
  status: string | null
  sent_at: string | null
  customers: { full_name: string | null; email: string | null } | null
}

const PAGE_SIZE = 25

export function CommsClient({ rows }: { rows: CommsRow[] }) {
  const [channel, setChannel] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const channels = useMemo(() => Array.from(new Set(rows.map((r) => r.channel).filter(Boolean))) as string[], [rows])
  const statuses = useMemo(() => Array.from(new Set(rows.map((r) => r.status).filter(Boolean))) as string[], [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    if (channel !== 'all' && r.channel !== channel) return false
    if (status !== 'all' && r.status !== status) return false
    return true
  }), [rows, channel, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Channel</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={channel}
            onChange={(e) => { setChannel(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {channels.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 mb-1">Status</label>
          <select
            className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            <option value="all">All</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="ml-auto text-sm text-neutral-500">{filtered.length} entries</div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Channel</th>
              <th className="text-left px-4 py-3 font-medium">Template</th>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r) => (
              <tr key={r.id} className="border-t border-neutral-100">
                <td className="px-4 py-3">
                  <div>{nullish(r.customers?.full_name)}</div>
                  <div className="text-xs text-neutral-500">{nullish(r.customers?.email ?? r.to_address)}</div>
                </td>
                <td className="px-4 py-3">{nullish(r.channel)}</td>
                <td className="px-4 py-3 text-neutral-700">{nullish(r.template)}</td>
                <td className="px-4 py-3">{nullish(r.subject)}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-xs">{formatDateTime(r.sent_at)}</td>
              </tr>
            ))}
            {paged.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No comms logged</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <button onClick={() => setPage(Math.max(1, current - 1))} disabled={current <= 1}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Prev</button>
          <span className="text-neutral-600">Page {current} of {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, current + 1))} disabled={current >= totalPages}
            className="px-3 py-1 border border-neutral-300 rounded disabled:opacity-40">Next</button>
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Verify**

`/admin/comms` — list paginated, channel + status filter work.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/comms src/components/admin/CommsClient.tsx
git commit -m "feat(admin): comms log page with channel and status filters"
```

---

### Task 11: Final smoke test + cleanup

**Files:**
- No new files; verify entire dashboard end-to-end and tighten any rough edges.

- [ ] **Step 1: Full navigation smoke test**

Sign in as admin. Click every sidebar item in order. For each:
- Page loads within ~1s on dev (with skeleton visible briefly).
- Active sidebar item is highlighted.
- No console errors in the browser devtools.
- Null joins render as "—", never blank or "undefined".
- Currency displays `$` with 2 decimals everywhere (Total, Subtotal, Lifetime spend, Quote, Revenue).
- Dates render in the "Apr 20, 2026 12:37 PM" format via `formatDateTime`.
- Pagination controls appear only when >25 rows; Prev/Next disable correctly at edges.

- [ ] **Step 2: Auth smoke test**

- Sign out → `/admin` redirects to `/login`.
- Sign in as a non-admin customer (flip `is_admin` to false via Supabase) → `/admin` redirects to `/`.
- Flip back to `is_admin=true` → admin works again.

- [ ] **Step 3: Mutation smoke test**

- On `/admin/catering`, change an inquiry's status → page reloaded status matches.
- On `/admin/reviews`, toggle approved + featured checkboxes → refresh → sticks.
- With devtools, POST the API with missing body → returns 400.

- [ ] **Step 4: Responsive check**

Shrink browser to ~1024px. Sidebar stays fixed, tables scroll horizontally inside their containers.

- [ ] **Step 5: TypeScript check**

Run: `npx tsc --noEmit`
Expected: no errors in any file you created.

- [ ] **Step 6: Build check**

Run: `npm run build`
Expected: build succeeds. Fix any server/client boundary errors (e.g. importing a client file into a server component without `'use client'`).

- [ ] **Step 7: Final commit and push**

```bash
git status
git add -A
git diff --cached --stat
git commit --allow-empty -m "chore(admin): smoke test passes"
git push -u origin HEAD
```

---

## Self-review — spec coverage check

| Spec section | Covered by |
|---|---|
| Tech stack (Next.js App Router, TS, Tailwind, Supabase) | Task 1 layout; uses existing `@supabase/ssr` clients |
| Auth: `is_admin = true`; redirect to `/` if not | Task 1 `requireAdmin()` + layout |
| Sidebar nav (no full page reloads) | Task 1 `AdminSidebar` with Next.js `Link` |
| Overview: totals, this/last month, weekly bars, recent orders, open inquiries | Task 2 |
| Orders: search, status/date/school filters, expand row detail, Stripe link | Task 3 |
| Customers: list with lifetime/orders/last order + detail (orders + comms) | Task 4 |
| Menu cycles: list with order count + revenue + detail with items and orders | Task 5 |
| Schools: list with order count + revenue | Task 6 |
| Catering inquiries (both tables merged) + status mutation | Task 7 |
| Reviews: stars + toggle is_approved / is_featured | Task 8 |
| Waitlist: list with school + cycle joins | Task 9 |
| Comms log: channel + status filters | Task 10 |
| Paginated 25/page everywhere | All client tables |
| Currency as USD with 2 decimals | `formatMoney` everywhere |
| Dates as "Apr 20, 2026 12:37 PM" | `formatDateTime` everywhere |
| Null joins display "—" | `nullish()` helper everywhere |
| Loading skeletons | `loading.tsx` per route + `loading.tsx` at `/admin` |
| Stripe Payment Intent link | Task 3 Stripe anchor |
| No new packages | Plan uses only existing deps (Next, React, Supabase, Tailwind, zod) |
| Don't touch customer-facing pages | Plan only edits files under `src/app/admin/*`, `src/app/api/admin/*`, `src/components/admin/*`, `src/lib/admin/*` |
| No DB schema changes | Plan only reads + updates existing columns |
| No Stripe secrets in frontend | Plan only links out to `dashboard.stripe.com` |

All spec requirements traced to a task. No placeholders. Types used in later tasks (`CateringRow`, `WeekBucket`, etc.) are exported from the files that define them and imported correctly.
