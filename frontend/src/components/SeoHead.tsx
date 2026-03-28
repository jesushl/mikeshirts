import { Helmet } from 'react-helmet-async'

interface Props {
  title: string
  description?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

export default function SeoHead({
  title,
  description = 'Tienda online de playeras originales que combinan cultura geek con identidad mexicana. Diseños únicos, producción local, envíos a todo México.',
  ogImage = '/logo.png',
  ogUrl,
  ogType = 'website',
  noindex,
  jsonLd,
}: Props) {
  const fullTitle = `${title} — Mike Shirts`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Mike Shirts" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {noindex && <meta name="robots" content="noindex" />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
