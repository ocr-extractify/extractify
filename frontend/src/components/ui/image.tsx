import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width = 48,
  height = 48,
  loading = 'lazy',
  className = '',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`aspect-square shrink-0 rounded-md object-cover ${className}`}
    />
  );
};

export { Image };
