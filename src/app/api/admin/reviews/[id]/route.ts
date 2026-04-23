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
