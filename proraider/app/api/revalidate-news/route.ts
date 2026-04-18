import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidateTag('arc-news')
  revalidatePath('/news')
  return NextResponse.json({ revalidated: true })
}
