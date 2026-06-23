
export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  focusKeywords?: string;
  seoScore?: number;
  schemaMarkup?: any;
}

export interface Product extends SEOData {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  priceRange: string;
  features: string[];
  icon: string;
  rating: number;
  image?: string;
  vendorName?: string;
  technicalSpecs?: { label: string; value: string }[];
}

export interface BlogPost extends SEOData {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: 'Service' | 'Product' | 'Marketplace' | 'Industry News';
  image: string;
  author: string;
  date: string;
}

export interface Category extends SEOData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface City extends SEOData {
  id: string;
  name: string;
  slug: string;
  stateId?: string;
}

export interface State extends SEOData {
  id: string;
  name: string;
  slug: string;
}

export interface StatCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: 'yellow' | 'blue' | 'green' | 'purple';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  mobile: string;
  location: string;
  company: string;
  service: string;
  budget: string;
  requirement: string;
  authority?: string;
  timing?: string;
  status: 'Pending' | 'Verified' | 'Sold' | 'Rejected';
  assignedTo?: string;
  remarks?: string;
  date: string;
}

export type UserRole = 'user' | 'vendor' | 'admin' | null;
export type VendorStatus = 'Pending' | 'Verified' | 'Rejected' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedDate: string;
  // Metadata/Derived fields (not in public.users table)
  mobile?: string;
  company?: string;
  location?: string;
  status?: VendorStatus;
  verificationDate?: string;
  verifiedBy?: string;
  products?: string[];
  services?: string[];
  logoUrl?: string;
  isFirstLogin?: boolean;
  full_name?: string;
}

export interface VendorAsset {
  id: string;
  name: string;
  logoUrl: string;
}

export interface VendorRegistration {
  id: string;
  name: string;
  companyName: string;
  mobile: string;
  email: string;
  location: string;
  productName: string;
  message: string;
  date: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  company: string;
  earnings: string;
  image: string;
}

export interface SiteConfig extends SEOData {
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
  adminNotificationEmail?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  whatsappNumber?: string;
  bannerImage?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}
