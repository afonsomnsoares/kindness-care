import { Helmet } from 'react-helmet-async';

export function MetaTags({ 
  title, 
  description, 
  image = 'https://www.kindnesscare.pt/og-image.jpg',
  url,
  type = 'website',
  schema = null
}) {
  const baseUrl = 'https://www.kindnesscare.pt';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullTitle = title ? `${title} | Kindness & Care` : 'Kindness & Care — Serviço de Apoio Domiciliário | Braga, Guimarães, Viana do Castelo';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_PT" />
      <meta property="og:site_name" content="Kindness & Care" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
