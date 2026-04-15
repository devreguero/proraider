'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { createListing, deleteListing } from '@/lib/db'

export type MarketFormState = {
  errors?: {
    offer_item_name?: string[]
    offer_quantity?: string[]
    want_item_name?: string[]
    want_quantity?: string[]
    contact?: string[]
    general?: string[]
  }
  success?: boolean
}

export async function createMarketListing(
  _state: MarketFormState,
  formData: FormData,
): Promise<MarketFormState> {
  const session = await getSession()
  if (!session) {
    return { errors: { general: ['Debes iniciar sesión para publicar.'] } }
  }

  const offerItemName   = (formData.get('offer_item_name') as string)?.trim()
  const offerItemRarity = (formData.get('offer_item_rarity') as string) || 'Common'
  const offerQtyRaw     = formData.get('offer_quantity') as string
  const wantItemName    = (formData.get('want_item_name') as string)?.trim()
  const wantItemRarity  = (formData.get('want_item_rarity') as string) || 'Common'
  const wantQtyRaw      = formData.get('want_quantity') as string
  const note            = (formData.get('note') as string)?.trim() || null
  const contact         = (formData.get('contact') as string)?.trim()

  const errors: MarketFormState['errors'] = {}

  if (!offerItemName || offerItemName.length < 2) errors.offer_item_name = ['Selecciona el item que ofreces.']

  const offerQty = parseInt(offerQtyRaw, 10)
  if (!offerQtyRaw || isNaN(offerQty) || offerQty < 1 || offerQty > 9999) errors.offer_quantity = ['La cantidad debe estar entre 1 y 9999.']

  if (!wantItemName || wantItemName.length < 2) errors.want_item_name = ['Selecciona el item que buscas a cambio.']

  const wantQty = parseInt(wantQtyRaw, 10)
  if (!wantQtyRaw || isNaN(wantQty) || wantQty < 1 || wantQty > 9999) errors.want_quantity = ['La cantidad debe estar entre 1 y 9999.']

  if (!contact || contact.length < 2) errors.contact = ['El contacto es obligatorio (Discord, usuario, etc.).']
  if (contact && contact.length > 100) errors.contact = ['El contacto no puede superar 100 caracteres.']

  if (Object.keys(errors).length > 0) return { errors }

  try {
    await createListing(
      session.userId, session.username,
      offerItemName, offerItemRarity, offerQty,
      wantItemName, wantItemRarity, wantQty,
      note, contact,
    )
  } catch {
    return { errors: { general: ['Error al publicar. Inténtalo de nuevo.'] } }
  }

  revalidatePath('/marketplace')
  return { success: true }
}

export async function deleteMarketListing(id: number): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: 'No autenticado.' }

  try {
    const result = await deleteListing(id, session.userId)
    if (result.rowsAffected === 0) return { error: 'Anuncio no encontrado o no tienes permiso.' }
  } catch {
    return { error: 'Error al eliminar.' }
  }

  revalidatePath('/marketplace')
  return {}
}
