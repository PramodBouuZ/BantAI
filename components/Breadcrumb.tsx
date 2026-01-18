
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SEO from './SEO';

interface BreadcrumbProps {
  items: {
    name: string;
    href?: string;
  }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  // The new schema structure is very specific and less dynamic.
  // This component will now need to be used carefully, as it assumes a 3-level structure.
  // For the product page, it will be: Home > Products > {ProductName}
  const itemListElement = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://bantconfirm.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://bantconfirm.com/products"
    },
    items.length > 2 ? { // Assuming the last item is the current product page
      "@type": "ListItem",
      "position": 3,
      "name": items[items.length - 1].name,
      "item": `https://bantconfirm.com${items[items.length - 1].href}`
    } : null
  ].filter(Boolean); // Filter out null if there's no 3rd item

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };

  return (
    <>
      <SEO schema={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="text-sm font-medium text-slate-500">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href ? (
                <Link to={item.href} className="hover:text-blue-600 transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className="font-semibold text-slate-700">{item.name}</span>
              )}
              {index < items.length - 1 && (
                <ChevronRight size={16} className="mx-2 text-slate-400" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
