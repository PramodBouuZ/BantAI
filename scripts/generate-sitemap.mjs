
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import 'dotenv/config';

// Load environment variables from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is not defined in the environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://www.bantconfirm.com';

async function generateSitemap() {
  console.log('Starting sitemap generation...');

  const urls = new Set();

  // 1. Add static pages
  const staticPages = [
    '',
    '/products',
    '/about',
    '/contact',
    '/features',
    '/blog',
    '/vendor-register'
  ];
  staticPages.forEach(page => urls.add(`${BASE_URL}${page}`));
  console.log(`Added ${staticPages.length} static pages.`);

  // 2. Fetch and add product URLs
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('slug, updated_at');

  if (productsError) {
    console.error('Error fetching products:', productsError);
  } else {
    products.forEach(product => {
      urls.add(`${BASE_URL}/products/${product.slug}`);
    });
    console.log(`Added ${products.length} product pages.`);
  }

  // 3. Fetch and add blog post URLs
  const { data: blogs, error: blogsError } = await supabase
    .from('blogs')
    .select('slug, updated_at');

  if (blogsError) {
    console.error('Error fetching blogs:', blogsError);
  } else {
    blogs.forEach(blog => {
      urls.add(`${BASE_URL}/blog/${blog.slug}`);
    });
    console.log(`Added ${blogs.length} blog pages.`);
  }

  // 4. (Future) Fetch and add category and city pages once they are implemented
  // For now, this provides a solid foundation.

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${[...urls].map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url === BASE_URL ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  // Ensure the 'public' directory exists
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }

  fs.writeFileSync('public/sitemap.xml', sitemapContent.trim());
  console.log(`Sitemap successfully generated with ${urls.size} URLs at public/sitemap.xml`);
}

generateSitemap();
