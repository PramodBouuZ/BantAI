
import React from 'react';
import { FileText } from 'lucide-react';

interface SEOContentBlockProps {
  title: string;
  content: string;
}

const SEOContentBlock: React.FC<SEOContentBlockProps> = ({ title, content }) => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="text-blue-600" size={28} /> {title}
          </h2>
          <div className="prose prose-lg prose-slate max-w-none leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </section>
  );
};

export default SEOContentBlock;
