import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import ProfileMenu from '@/components/ProfileMenu'
import NotificationButton from '@/components/NotificationButton'
import NavSidebarLinks from '@/components/NavSidebarLinks'

export default async function Navbar() {
  const session = await getSession()

  return (
    <aside className="group fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-white/8 bg-[#111111] transition-[width] duration-200 ease-out hover:w-52">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 overflow-hidden border-b border-white/8 px-2.5">
        <Link href="/" aria-label="ProRaider" className="flex shrink-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
            <Image
              src="/proraider-logo.png?v=2"
              alt="ProRaider"
              fill
              priority
              unoptimized
              className="object-cover object-left"
            />
          </div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-black text-white opacity-0 transition-all duration-150 group-hover:max-w-xs group-hover:opacity-100">
            ProRaider
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <NavSidebarLinks />

      {/* Bottom: notifications + profile/login */}
      <div className="flex shrink-0 flex-col gap-1 border-t border-white/8 py-3 px-2">
        {session ? (
          <>
            <NotificationButton />
            <ProfileMenu username={session.username} email={session.email} />
          </>
        ) : (
          <Link
            href="/login"
            className="flex h-10 w-full items-center gap-3 overflow-hidden rounded-xl px-2.5 text-white/35 transition hover:bg-white/8 hover:text-white/80"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-semibold opacity-0 transition-all duration-150 delay-75 group-hover:max-w-xs group-hover:opacity-100">
              Iniciar sesión
            </span>
          </Link>
        )}
      </div>
    </aside>
  )
}
