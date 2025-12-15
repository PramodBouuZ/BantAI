import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  schema?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Transform your IT procurement with BantConfirm. Connect with verified vendors for Software, Telecom, and Cloud services in Delhi, Mumbai, Bangalore and Pan India.",
  keywords = "B2B Marketplace, IT Procurement, Software India, Telecom Services, BANT Verification, MSME Business, Verified Vendors, IT Company near me",
  canonicalUrl = window.location.href,
  schema
}) => {
  const siteTitle = "BantConfirm";
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} - B2B Marketplace for IT & Software`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Geo Tags for Local SEO - Defaulting to India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {/* Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;