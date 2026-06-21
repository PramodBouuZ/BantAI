const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = 'https://bantconfirm.com';

/**
 * Simple .env loader to support local development without adding dependencies
 */
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from .env file...');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = (match[2] || '').trim();
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    });
  }
}

// Fallback data if Supabase fetch fails or environment variables are missing
const fallbackProducts = [
  'crm-solutions', 'cloud-telephony', 'internet-leased-line',
  'sip-trunk-services', 'cloud-storage', 'cybersecurity',
  'hrms-platform', 'toll-free-services'
];

async function generateSitemap() {
  loadEnv();

  let productSlugs = [...fallbackProducts];
  let blogSlugs = [];
  let categorySlugs = [];
  let locationSlugs = [];

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      console.log('Fetching dynamic routes from Supabase...');

      const fetchSupabase = (table) => new Promise((resolve, reject) => {
        const cleanUrl = supabaseUrl.replace(/\/$/, '');
        const url = `${cleanUrl}/rest/v1/${table}?select=slug`;

        https.get(url, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              if (res.statusCode >= 400) {
                reject(new Error(`Supabase API error (${res.statusCode}): ${data}`));
              } else {
                resolve(parsed);
              }
            } catch (e) {
              reject(new Error(`Failed to parse response from ${table}: ${data.substring(0, 100)}`));
            }
          });
        }).on('error', reject);
      });

      const [products, blogs, categories, cities, states] = await Promise.all([
        fetchSupabase('products').catch(() => null),
        fetchSupabase('blogs').catch(() => null),
        fetchSupabase('categories').catch(() => null),
        fetchSupabase('cities').catch(() => null),
        fetchSupabase('states').catch(() => null)
      ]);

      if (Array.isArray(products) && products.length > 0) {
        productSlugs = Array.from(new Set([...productSlugs, ...products.map(p => p.slug).filter(Boolean)]));
      }
      if (Array.isArray(blogs) && blogs.length > 0) {
        blogSlugs = blogs.map(b => b.slug).filter(Boolean);
      }
      if (Array.isArray(categories) && categories.length > 0) {
        categorySlugs = categories.map(c => c.slug).filter(Boolean);
      }
      if (Array.isArray(cities) && cities.length > 0) {
        locationSlugs = [...locationSlugs, ...cities.map(c => c.slug).filter(Boolean)];
      }
      if (Array.isArray(states) && states.length > 0) {
        locationSlugs = [...locationSlugs, ...states.map(s => s.slug).filter(Boolean)];
      }

      console.log(`Included ${productSlugs.length} products, ${blogSlugs.length} blogs, ${categorySlugs.length} categories, and ${locationSlugs.length} locations.`);
    } catch (err) {
      console.error('Unexpected error fetching from Supabase:', err.message);
    }
  }

  const staticRoutes = [
    '', '/products', '/blog', '/about', '/contact', '/features',
    '/vendor-register', '/compare', '/login', '/privacy', '/terms'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${productSlugs.map(slug => `  <url>
    <loc>${BASE_URL}/products/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
${blogSlugs.map(slug => `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${categorySlugs.map(slug => `  <url>
    <loc>${BASE_URL}/category/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
${locationSlugs.map(slug => `  <url>
    <loc>${BASE_URL}/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicPath = path.join(__dirname, '../public');
  if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemap.trim());
  console.log(`Sitemap successfully generated at ${path.join(publicPath, 'sitemap.xml')}`);
}

generateSitemap();
