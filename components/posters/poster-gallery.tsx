'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Poster } from '@/lib/types';

interface PosterGalleryProps {
  posters: Poster[];
}

export function PosterGallery({ posters }: PosterGalleryProps) {
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openLightbox = (poster: Poster, index: number) => {
    setSelectedPoster(poster);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPoster(null);
  };

  const nextPoster = () => {
    const nextIdx = (currentIndex + 1) % posters.length;
    setCurrentIndex(nextIdx);
    setSelectedPoster(posters[nextIdx]);
  };

  const prevPoster = () => {
    const prevIdx = (currentIndex - 1 + posters.length) % posters.length;
    setCurrentIndex(prevIdx);
    setSelectedPoster(posters[prevIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPoster) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPoster();
      if (e.key === 'ArrowLeft') prevPoster();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPoster, currentIndex]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {posters.map((poster, index) => {
          const mainTitle = poster.title || poster.title_bn || 'Untitled Artwork';
          const subTitle = poster.title_bn && poster.title_bn !== poster.title ? poster.title_bn : null;

          return (
            <div
              key={poster.id}
              onClick={() => openLightbox(poster, index)}
              className="group cursor-pointer border border-paper-200 dark:border-ink-800 bg-paper-100/50 dark:bg-ink-900/40 rounded-lg overflow-hidden hover:border-accent/50 transition-all shadow-sm flex flex-col"
            >
              {/* Image Thumbnail Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-200 dark:bg-ink-950">
                <Image
                  src={poster.image_url}
                  alt={mainTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-ink-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 rounded-full bg-paper-50/90 dark:bg-ink-900/90 text-accent shadow-lg">
                    <Maximize2 className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Poster Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium text-paper-900 dark:text-ink-100 group-hover:text-accent transition-colors">
                    {mainTitle}
                  </h3>
                  {subTitle && (
                    <p className="font-bengaliSerif text-xs text-paper-700 dark:text-ink-300 mt-0.5">
                      {subTitle}
                    </p>
                  )}
                  {poster.description && (
                    <p className="text-xs text-paper-700 dark:text-ink-300 font-serif mt-2 line-clamp-2">
                      {poster.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-paper-200 dark:border-ink-800/60 flex items-center justify-between text-[11px] text-paper-700 dark:text-ink-300 font-mono">
                  <span>{poster.dimensions || 'Archival Print'}</span>
                  <span className="text-accent font-sans font-medium flex items-center gap-1 group-hover:underline">
                    View full &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPoster && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 backdrop-blur-md p-4 md:p-8"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-ink-900/80 text-ink-200 hover:text-white border border-ink-800 transition-colors z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPoster();
            }}
            className="hidden md:flex absolute left-6 p-3 rounded-full bg-ink-900/80 text-ink-200 hover:text-white border border-ink-800 transition-colors z-10"
            aria-label="Previous Poster"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPoster();
            }}
            className="hidden md:flex absolute right-6 p-3 rounded-full bg-ink-900/80 text-ink-200 hover:text-white border border-ink-800 transition-colors z-10"
            aria-label="Next Poster"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Inner Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
          >
            {/* Full Image */}
            <div className="relative w-full h-[65vh] md:h-[75vh]">
              <Image
                src={selectedPoster.high_res_url || selectedPoster.image_url}
                alt={selectedPoster.title || selectedPoster.title_bn || 'Artwork'}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Poster Info Bar & Download Button */}
            <div className="w-full mt-4 p-4 rounded-lg bg-ink-900/90 border border-ink-800 text-ink-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-white">
                  {selectedPoster.title || selectedPoster.title_bn}
                </h3>
                {selectedPoster.title_bn && selectedPoster.title_bn !== selectedPoster.title && (
                  <p className="font-bengaliSerif text-xs text-ink-300">
                    {selectedPoster.title_bn}
                  </p>
                )}
                <p className="text-xs text-ink-400 font-mono mt-1">
                  {selectedPoster.dimensions || 'Archival Print'}
                </p>
              </div>

              <a
                href={selectedPoster.high_res_url || selectedPoster.image_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white dark:text-ink-950 font-medium text-xs hover:bg-accent-hover transition-colors shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
