import { Product, Lead, Testimonial } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'CRM Solutions',
    description: 'Complete Customer Relationship Management systems tailored to your business needs.',
    category: 'Software',
    priceRange: '₹4,000 - ₹40,000/month',
    features: ['Contact Management', 'Sales Pipeline', 'GST Invoicing'],
    icon: 'users',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Cloud Telephony',
    description: 'Advanced cloud-based phone systems with IVR, call recording, and analytics.',
    category: 'Telecom',
    priceRange: '₹2,500 - ₹25,000/month',
    features: ['Virtual +91 Numbers', 'Call Recording', 'IVR System'],
    icon: 'cloud',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Internet Leased Line',
    description: 'Dedicated high-speed internet connectivity with guaranteed bandwidth for offices.',
    category: 'Connectivity',
    priceRange: '₹15,000 - ₹1.5 Lakh/month',
    features: ['Dedicated Bandwidth', '99.9% Uptime', '24/7 Local Support'],
    icon: 'wifi',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'SIP Trunk Services',
    description: 'Cost-effective voice communication over IP with unlimited scalability.',
    category: 'Telecom',
    priceRange: '₹1,500 - ₹15,000/month',
    features: ['Unlimited Channels', 'DID Numbers', 'DOT Compliant'],
    icon: 'phone',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Cloud Storage',
    description: 'Secure and scalable cloud storage solutions for your business data.',
    category: 'Infrastructure',
    priceRange: '₹800 - ₹8,000/month',
    features: ['Data Locality (India)', 'Auto Backup', 'File Sharing'],
    icon: 'database',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Cybersecurity',
    description: 'Comprehensive security solutions to protect your business from threats.',
    category: 'Security',
    priceRange: '₹8,000 - ₹80,000/month',
    features: ['Firewall', 'Threat Detection', 'Data Encryption'],
    icon: 'shield',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    title: 'HRMS Platform',
    description: 'Automate your HR processes with our all-in-one human resource management system.',
    category: 'Software',
    priceRange: '₹500 - ₹1,500/user',
    features: ['Payroll & PF', 'Attendance', 'Performance'],
    icon: 'users',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1553877606-3c669116e88e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    title: 'Toll Free Services',
    description: 'Enhance brand image with 1800 toll-free numbers for your customers.',
    category: 'Telecom',
    priceRange: '₹1,200 - ₹8,000/month',
    features: ['Pan India Coverage', 'Call Analytics', 'Vanity Numbers'],
    icon: 'phone',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80'
  }
];

export const RECENT_LEADS: Lead[] = [
  { 
    id: 'L001', 
    name: 'Rahul Sharma',
    email: 'rahul@sharmaenterprises.in',
    mobile: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    company: 'Sharma Enterprises', 
    service: 'CRM Solutions', 
    budget: '₹4L - ₹8L', 
    requirement: 'Need a CRM for 20 sales agents',
    status: 'Verified', 
    date: '2023-10-24' 
  },
  { 
    id: 'L002', 
    name: 'Anita Desai',
    email: 'anita@btp.com',
    mobile: '+91 98765 43211',
    location: 'Bangalore, Karnataka',
    company: 'Bangalore Tech Park', 
    service: 'Cloud Telephony', 
    budget: '₹1L - ₹3L', 
    requirement: 'Setting up support center with 15 agents',
    status: 'Pending', 
    date: '2023-10-24' 
  },
  { 
    id: 'L003', 
    name: 'Vikram Singh',
    email: 'vikram@globallogistics.in',
    mobile: '+91 98765 43212',
    location: 'Delhi NCR',
    company: 'Global Logistics India', 
    service: 'Leased Line', 
    budget: '₹40,000/mo', 
    requirement: 'Dedicated 50Mbps line for warehouse',
    status: 'Sold', 
    date: '2023-10-23' 
  },
  { 
    id: 'L004', 
    name: 'Dr. Priya Mehta',
    email: 'admin@caredental.com',
    mobile: '+91 98765 43213',
    location: 'Mumbai, Maharashtra',
    company: 'Care Dental Mumbai', 
    service: 'Web Hosting', 
    budget: '₹5,000/mo', 
    requirement: 'Hosting for patient booking portal',
    status: 'Verified', 
    date: '2023-10-23' 
  },
  { 
    id: 'L005', 
    name: 'Arjun Kapoor',
    email: 'arjun@delhilegal.com',
    mobile: '+91 98765 43214',
    location: 'New Delhi',
    company: 'Delhi Legal Partners', 
    service: 'Cybersecurity', 
    budget: '₹1.5L/mo', 
    requirement: 'Endpoint security for 50 workstations',
    status: 'Pending', 
    date: '2023-10-22' 
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    text: "BantConfirm transformed how we handle excess leads. We've earned over ₹35 Lakhs in commissions in just 6 months. Best platform for Indian B2B.",
    author: "Rajesh Kumar",
    role: "CEO",
    company: "TechStart Solutions",
    earnings: "₹35L earned",
    image: "https://picsum.photos/100/100?random=1"
  },
  {
    id: 't2',
    text: "I was skeptical at first, but the platform exceeded all expectations. The AI matching is spot-on for the domestic market.",
    author: "Priya Mehta",
    role: "Founder",
    company: "Digital Marketing Pro",
    earnings: "₹24L earned",
    image: "https://picsum.photos/100/100?random=2"
  },
  {
    id: 't3',
    text: "The real-time analytics and instant UPI payments make this platform a game-changer. We've integrated it into our standard workflow.",
    author: "Amit Singh",
    role: "Director",
    company: "Growth Ventures",
    earnings: "₹45L earned",
    image: "https://picsum.photos/100/100?random=3"
  }
];