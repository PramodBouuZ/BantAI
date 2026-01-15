
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
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href ? `https://www.bantconfirm.com${item.href}` : undefined
    }))
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
