import React, { useState, useEffect } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, fallback, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  if (loading) {
    return <div className={`animate-pulse bg-slate-200 ${className}`} />;
  }

  if (error || !imgSrc) {
    return fallback ? (
      <img src={fallback} alt={alt} className={className} {...props} />
    ) : (
      <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
        <span className="text-slate-400 text-xs">No Image</span>
      </div>
    );
  }

  // Optimization: use WebP if supported (basic implementation)
  // In a real production app, we would use a service like Cloudinary or Vercel Image Optimization

  return (
    <picture>
      {/* If we had WebP versions, we would add them here */}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </picture>
  );
};

export default React.memo(LazyImage);
