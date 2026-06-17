import React from 'react';
import { Link } from 'react-router-dom';

interface InternalLinkSuggestion {
  text: string;
  path: string;
  match: RegExp;
}

export const useInternalLinking = () => {
  const getSuggestions = (content: string, products: any[], categories: any[], locations: any[]): InternalLinkSuggestion[] => {
    const suggestions: InternalLinkSuggestion[] = [];

    // Suggest Products & Services
    products.forEach(p => {
      const regex = new RegExp(`\\b${p.title}\\b`, 'gi');
      if (regex.test(content)) {
        // Use /services/ if it's likely a service, else /products/
        const isService = p.category === 'Telecom' || p.category === 'Connectivity' || p.category === 'Consulting';
        const path = isService ? `/services/${p.slug}` : `/products/${p.slug}`;
        suggestions.push({ text: p.title, path, match: regex });
      }
    });

    // Suggest Categories
    categories.forEach(c => {
      const regex = new RegExp(`\\b${c.name}\\b`, 'gi');
      if (regex.test(content)) {
        suggestions.push({ text: c.name, path: `/category/${c.slug}`, match: regex });
      }
    });

    // Suggest Locations
    locations.forEach(l => {
      const regex = new RegExp(`\\b${l.name}\\b`, 'gi');
      if (regex.test(content)) {
        suggestions.push({ text: l.name, path: `/${l.slug}`, match: regex });
      }
    });

    return suggestions;
  };

  const wrapInternalLinks = (content: string, suggestions: InternalLinkSuggestion[]): React.ReactNode[] => {
    if (!suggestions.length) return [content];

    let parts: (string | React.ReactNode)[] = [content];

    // Sort suggestions by length descending to match longer phrases first
    const sortedSuggestions = [...suggestions].sort((a, b) => b.text.length - a.text.length);

    sortedSuggestions.forEach(suggestion => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach(part => {
        if (typeof part !== 'string') {
          newParts.push(part);
          return;
        }

        const subParts = part.split(suggestion.match);
        const matches = part.match(suggestion.match);

        subParts.forEach((subPart, i) => {
          newParts.push(subPart);
          if (i < subParts.length - 1 && matches) {
            newParts.push(
              <Link key={`${suggestion.path}-${i}-${Math.random()}`} to={suggestion.path} className="text-blue-600 font-bold hover:underline">
                {matches[i]}
              </Link>
            );
          }
        });
      });
      parts = newParts;
    });

    return parts;
  };

  return { getSuggestions, wrapInternalLinks };
};
