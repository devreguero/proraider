'use client'

import { useEffect, useRef } from 'react'
import type L from 'leaflet'
import type { MapDef } from '@/lib/mapsData'
import { SPAWN_DATA } from '@/lib/spawnData'
import { KEYS_DATA } from '@/lib/keysData'
import type { LayerKey } from './MapLayout'

const TILE_SIZE = 512
const MAP_UNITS  = 1024
const DEV_MODE   = false

const RARITY_COLORS: Record<string, string> = {
  uncommon:   '#4ade80',
  rare:       '#60a5fa',
  epic:       '#c084fc',
  'power-rod': '#f97316',
  'fuel-cell': '#facc15',
}

type Props = { map: MapDef; activeLayers: Set<LayerKey> }

export default function MapViewer({ map, activeLayers }: Props) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const mapRef          = useRef<L.Map | null>(null)
  const spawnMarkersRef = useRef<L.Marker[]>([])
  const keyMarkersRef   = useRef<L.Marker[]>([])
  const activeLayersRef = useRef(activeLayers)

  useEffect(() => { activeLayersRef.current = activeLayers }, [activeLayers])

  // ── Init Leaflet ───────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    let observer: ResizeObserver | null = null
    let destroyed = false

    import('leaflet').then((L) => {
      if (destroyed || !container) return

      const sw          = L.latLng(-MAP_UNITS, 0)
      const ne          = L.latLng(0, MAP_UNITS)
      const imageBounds = L.latLngBounds(sw, ne)
      const tileId      = map.tileId

      const lMap = L.map(container, {
        crs: L.CRS.Simple,
        minZoom: -5,
        maxZoom: 3,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        attributionControl: false,
        zoomControl: false,
        maxBounds: imageBounds.pad(0.05),
        maxBoundsViscosity: 1.0,
      })

      // Tile layer
      const tileLayer = L.tileLayer('', {
        tileSize: TILE_SIZE,
        minNativeZoom: 0,
        maxNativeZoom: 3,
        noWrap: true,
        keepBuffer: 4,
        updateWhenIdle: false,
        updateWhenZooming: false,
      } as L.TileLayerOptions)

      ;(tileLayer as L.TileLayer & { getTileUrl(c: L.Coords): string }).getTileUrl = (c) => {
        const q = c.z >= 2 ? 'high' : 'low'
        return `https://cdn.arctracker.io/maps/tiles/${tileId}/v2/${q}/${c.z}/${c.x}/${c.y}.webp`
      }
      tileLayer.addTo(lMap)
      L.control.zoom({ position: 'bottomright' }).addTo(lMap)

      // ── Spawn markers ────────────────────────────────────────────────────
      const spawnIcon = L.divIcon({
        className: '',
        iconSize:   [22, 22],
        iconAnchor: [11, 11],
        html: `<div style="width:22px;height:22px;background:#fff;border-radius:50%;
                box-shadow:0 1px 4px rgba(0,0,0,0.7);
                display:flex;align-items:center;justify-content:center;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#111111">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
          </svg>
        </div>`,
      })

      const spawns  = SPAWN_DATA[map.id] ?? []
      const spawnMarkers = spawns.map((sp) => {
        const m = L.marker([sp.lat, sp.lng], { icon: spawnIcon })
        if (sp.label) m.bindTooltip(sp.label, { permanent: false, direction: 'top', offset: [0, -14], className: 'spawn-tooltip' })
        return m
      })
      spawnMarkersRef.current = spawnMarkers

      if (activeLayersRef.current.has('playerSpawn')) {
        spawnMarkers.forEach((m) => m.addTo(lMap))
      }

      // ── Key markers ──────────────────────────────────────────────────────
      const keys = KEYS_DATA[map.id] ?? []
      const keyMarkers = keys.map((kp) => {
        const color = RARITY_COLORS[kp.rarity] ?? '#facc15'
        const icon = L.divIcon({
          className: '',
          iconSize:   [24, 24],
          iconAnchor: [12, 12],
          html: `<div style="
            width:24px;height:24px;
            background:${color};
            border-radius:6px;
            box-shadow:0 1px 6px rgba(0,0,0,0.8);
            display:flex;align-items:center;justify-content:center;
          ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#000">
              <path d="M12.65 10A6 6 0 1 0 8 17H9v2h2v2h4v-4h2l.35-.35A6 6 0 0 0 12.65 10ZM8 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/>
            </svg>
          </div>`,
        })
        const m = L.marker([kp.lat, kp.lng], { icon })
        m.bindPopup(`
          <div style="font-family:sans-serif;min-width:200px">
            <div style="font-size:11px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">${kp.rarity}</div>
            <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px">${kp.name}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px">📍 ${kp.location}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.5">${kp.description}</div>
          </div>
        `, {
          className: 'key-popup',
          maxWidth: 260,
        })
        return m
      })
      keyMarkersRef.current = keyMarkers

      if (activeLayersRef.current.has('keys')) {
        keyMarkers.forEach((m) => m.addTo(lMap))
      }

      // Dev coords
      if (DEV_MODE) {
        lMap.on('click', (e: L.LeafletMouseEvent) => {
          const t = `{ lat: ${Math.round(e.latlng.lat)}, lng: ${Math.round(e.latlng.lng)} }`
          navigator.clipboard.writeText(t)
        })
      }

      mapRef.current = lMap

      // Cover zoom
      const coverZoom = (w: number, h: number) => Math.log2(Math.max(w, h) / MAP_UNITS)

      const applyView = () => {
        if (!mapRef.current || !container.clientWidth) return
        mapRef.current.invalidateSize()
        const z = coverZoom(container.clientWidth, container.clientHeight)
        mapRef.current.setMinZoom(z)
        if (mapRef.current.getZoom() < z)
          mapRef.current.setView(imageBounds.getCenter(), z, { animate: false })
      }

      let fitted = false
      observer = new ResizeObserver(() => {
        if (!mapRef.current || !container.clientWidth || !container.clientHeight) return
        mapRef.current.invalidateSize()
        const z = coverZoom(container.clientWidth, container.clientHeight)
        mapRef.current.setMinZoom(z)
        if (!fitted) { fitted = true; mapRef.current.setView(imageBounds.getCenter(), z, { animate: false }) }
      })
      observer.observe(container)
      setTimeout(() => { if (!fitted) { fitted = true; applyView() } }, 150)
      setTimeout(applyView, 400)
      lMap.on('resize', applyView)
    })

    return () => {
      destroyed = true
      observer?.disconnect()
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [map.id, map.tileId])

  // ── React to layer toggles ─────────────────────────────────────────────────
  useEffect(() => {
    const lMap = mapRef.current
    if (!lMap) return

    if (activeLayers.has('playerSpawn')) spawnMarkersRef.current.forEach((m) => m.addTo(lMap))
    else spawnMarkersRef.current.forEach((m) => m.remove())

    if (activeLayers.has('keys')) keyMarkersRef.current.forEach((m) => m.addTo(lMap))
    else keyMarkersRef.current.forEach((m) => m.remove())
  }, [activeLayers])

  return (
    <div ref={containerRef} className="h-full w-full" style={{ background: '#0e0e0e' }} />
  )
}
