import { useEffect, useState } from 'react'

// AnalyticsLoader tenta importar dinamicamente o pacote do Vercel Analytics
// Suporta vários possíveis nomes de pacote e aceita falhar silenciosamente
export default function AnalyticsLoader() {
  const [AnalyticsComponent, setAnalyticsComponent] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      const candidates = [
        '@vercel/analytics',
        '@vercel/analytics/react',
        '@vercel/analytics/next',
      ]

      for (const name of candidates) {
        try {
          // tentativa de import dinâmico
          const mod = await import(/* @vite-ignore */ name)
          const Comp = mod?.Analytics || mod?.default || null
          if (Comp && mounted) {
            setAnalyticsComponent(() => Comp)
            return
          }
        } catch {
          // ignore - pacote pode não estar instalado
        }
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  if (!AnalyticsComponent) return null
  return <AnalyticsComponent />
}
