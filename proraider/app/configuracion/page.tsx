import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import ConfigClient from './ConfigClient'

export const metadata = { title: 'Configuración · ProRaider' }

export default async function ConfiguracionPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-black text-white">Configuración</h1>
      <ConfigClient username={session.username} email={session.email} />
    </div>
  )
}
