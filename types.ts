
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  priceRange: string;
  features: string[];
  icon: string;
  rating: number;
  image?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile?: string;
  company?: string;
  location?: string;
  joinedDate: string;
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

export interface SiteConfig {
  siteName: string;
  logoUrl?: string;
  faviconUrl?: string;
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
