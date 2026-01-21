import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  const { data: products, error } = await supabase.from('products').select('slug');

  if (error) {
    console.error('Error fetching products', error);
    return;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.bantconfirm.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://www.bantconfirm.com/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  ${products
    .map(
      (product) => `
  <url>
    <loc>https://www.bantconfirm.com/products/${product.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.64</priority>
  </url>
`
    )
    .join('')}
</urlset>
  `;

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
}

generateSitemap();
