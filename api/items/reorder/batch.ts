import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../../_db'
import { items } from '../../../src/server/db/schema'
import { eq } from 'drizzle-orm'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { items: orderItems } = req.body as { items: { id: string; position: number }[] }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: 'Lista de itens é obrigatória' })
    }

    for (const item of orderItems) {
      if (!item.id || !UUID_REGEX.test(item.id)) {
        return res.status(400).json({ error: `ID inválido: ${item.id}` })
      }
      if (typeof item.position !== 'number' || !Number.isFinite(item.position)) {
        return res.status(400).json({ error: `Posição inválida para item ${item.id}` })
      }
    }

    await Promise.all(orderItems.map((item) => db.update(items).set({ position: item.position }).where(eq(items.id, item.id))))
    return res.json({ success: true })
  } catch (error) {
    console.error('Error reordering items:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
