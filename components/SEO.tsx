import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData } from '../types';

interface SEOProps extends SEOData {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product' | 'business.business';
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description = "Transform your IT procurement with BantConfirm. Connect with verified vendors for Software, Telecom, and Cloud services in Delhi, Mumbai, Bangalore and Pan India.",
  keywords = "B2B Marketplace, IT Procurement, Software India, Telecom Services, BANT Verification, MSME Business, Verified Vendors, IT Company near me",
  canonicalUrl,
  image,
  type = 'website',
  metaTitle,
  metaDescription,
  ogTitle,
  ogDescription,
  ogImage,
  twitterTitle,
  twitterDescription,
  twitterImage,
  schemaMarkup
}) => {
  const siteTitle = "BantConfirm";
  const displayTitle = metaTitle || title;
  const fullTitle = displayTitle ? `${displayTitle} | ${siteTitle}` : `${siteTitle} - B2B Marketplace for IT & Software`;
  const displayDescription = metaDescription || description;
  const displayCanonical = canonicalUrl || window.location.href;
  const displayImage = ogImage || twitterImage || image || 'https://bantconfirm.com/og-image.jpg';

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={displayDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={displayCanonical} />

      {/* Geo Tags for Local SEO - Defaulting to India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || displayDescription} />
      <meta property="og:image" content={displayImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:url" content={displayCanonical} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle || ogTitle || fullTitle} />
      <meta name="twitter:description" content={twitterDescription || ogDescription || displayDescription} />
      <meta name="twitter:image" content={displayImage} />

      {/* Schema.org Structured Data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {typeof schemaMarkup === 'string' ? schemaMarkup : JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;