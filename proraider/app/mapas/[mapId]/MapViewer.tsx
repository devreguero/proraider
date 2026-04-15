'use client'

import { useEffect, useRef } from 'react'
import type L from 'leaflet'
import type { MapDef } from '@/lib/mapsData'
import { SPAWN_DATA } from '@/lib/spawnData'
import type { LayerKey } from './MapLayout'

const TILE_SIZE = 512
const MAP_UNITS  = 1024
const DEV_MODE   = false

type Props = { map: MapDef; activeLayers: Set<LayerKey> }

export default function MapViewer({ map, activeLayers }: Props) {
  const containerRef     = useRef<HTMLDivElement>(null)
  const mapRef           = useRef<L.Map | null>(null)
  const spawnMarkersRef  = useRef<L.Marker[]>([])
  // Keep a live reference to activeLayers so the Leaflet init closure can read it
  const activeLayersRef  = useRef(activeLayers)

  useEffect(() => { activeLayersRef.current = activeLayers }, [activeLayers])

  // ── Init Leaflet ───────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    let observer: ResizeObserver | null = null
    let destroyed = false

    import('leaflet').then((L) => {
      if (destroyed || !container) return

      const sw           = L.latLng(-MAP_UNITS, 0)
      const ne           = L.latLng(0, MAP_UNITS)
      const imageBounds  = L.latLngBounds(sw, ne)
      const tileId       = map.tileId

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

      // Tile layer with quality switch
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

      // Spawn markers
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
      const markers = spawns.map((sp) => {
        const m = L.marker([sp.lat, sp.lng], { icon: spawnIcon })
        if (sp.label) m.bindTooltip(sp.label, { permanent: false, direction: 'top', offset: [0, -14], className: 'spawn-tooltip' })
        return m
      })
      spawnMarkersRef.current = markers

      // Add markers that are active at init time
      if (activeLayersRef.current.has('playerSpawn')) {
        markers.forEach((m) => m.addTo(lMap))
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

  // ── React to layer toggles (after map is ready) ────────────────────────────
  useEffect(() => {
    const lMap = mapRef.current
    if (!lMap) return
    const markers = spawnMarkersRef.current
    if (activeLayers.has('playerSpawn')) markers.forEach((m) => m.addTo(lMap))
    else markers.forEach((m) => m.remove())
  }, [activeLayers])

  return (
    <div ref={containerRef} className="h-full w-full" style={{ background: '#0e0e0e' }} />
  )
}
