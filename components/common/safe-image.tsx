"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface SafeImageProps {
  src: string;
  alt: string;
  fallback?: string | React.ReactNode;
  className?: string;
  priority?: boolean;
  useThumbnail?: boolean;
}

export function SafeImage({ src, alt, fallback = "🖼️", className = "", priority = false, useThumbnail = false }: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate thumbnail path for intro images
  const thumbnailSrc = useThumbnail && src.includes('/images/intro/') 
    ? src.replace('/images/intro/', '/images/intro/thumbs/')
    : src;

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-6xl filter drop-shadow-lg">{fallback}</span>
      </div>
    );
  }

  return (
    <motion.img
      ref={imgRef}
      src={thumbnailSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
