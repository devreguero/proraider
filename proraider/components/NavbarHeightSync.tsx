'use client'

import { useEffect } from 'react'

// Sets --navbar-h CSS variable on <html> so other elements can use it
// without hardcoding a pixel value.
export default function NavbarHeightSync() {
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return
    const update = () => {
      document.documentElement.style.setProperty(
        '--navbar-h',
        `${header.offsetHeight}px`
      )
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(header)
    return () => ro.disconnect()
  }, [])
  return null
}
