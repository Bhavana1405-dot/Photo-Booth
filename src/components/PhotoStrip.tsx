import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2 } from 'lucide-react';

interface PhotoStripProps {
  photos: string[];
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stripDataUrl, setStripDataUrl] = useState<string>('');

  useEffect(() => {
    generatePhotoStrip();
  }, [photos]);

  const generatePhotoStrip = async () => {
    if (!canvasRef.current || photos.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions for a classic photo strip (2:8 ratio)
    const stripWidth = 400;
    const photoHeight = 300;
    const padding = 20;
    const headerHeight = 60;
    const footerHeight = 40;
    const stripHeight = headerHeight + (photoHeight * photos.length) + (padding * (photos.length + 1)) + footerHeight;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, stripHeight);
    gradient.addColorStop(0, '#8B5CF6'); // purple
    gradient.addColorStop(0.5, '#EC4899'); // pink
    gradient.addColorStop(1, '#06B6D4'); // cyan
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Add decorative border
    ctx.strokeStyle = '#FBBF24'; // yellow
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, stripWidth - 8, stripHeight - 8);

    // Add inner border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, stripWidth - 24, stripHeight - 24);

    // Add header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTOBOOTH', stripWidth / 2, 40);

    // Add date
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 14px Arial';
    const today = new Date().toLocaleDateString();
    ctx.fillText(today, stripWidth / 2, 55);

    // Load and draw photos
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      for (let i = 0; i < photos.length; i++) {
        const img = await loadImage(photos[i]);
        const y = headerHeight + padding + (i * (photoHeight + padding));
        
        // Add photo background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(padding, y, stripWidth - (padding * 2), photoHeight);
        
        // Calculate aspect ratio to fit photo
        const photoWidth = stripWidth - (padding * 2) - 16;
        const aspectRatio = img.width / img.height;
        let drawWidth = photoWidth;
        let drawHeight = photoHeight - 16;
        
        if (aspectRatio > drawWidth / drawHeight) {
          drawHeight = drawWidth / aspectRatio;
        } else {
          drawWidth = drawHeight * aspectRatio;
        }
        
        const drawX = (stripWidth - drawWidth) / 2;
        const drawY = y + (photoHeight - drawHeight) / 2;
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Add photo number
        ctx.fillStyle = '#FBBF24';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${i + 1}`, stripWidth - 30, y + 25);
      }

      // Add footer
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      const footerY = stripHeight - 20;
      ctx.fillText('✨ TOTALLY RAD ✨', stripWidth / 2, footerY);

      setStripDataUrl(canvas.toDataURL('image/jpeg', 0.9));
    } catch (error) {
      console.error('Error generating photo strip:', error);
    }
  };

  const downloadStrip = () => {
    if (!stripDataUrl) return;

    const link = document.createElement('a');
    link.download = `photobooth-strip-${Date.now()}.jpg`;
    link.href = stripDataUrl;
    link.click();
  };

  const shareStrip = async () => {
    if (!stripDataUrl) return;

    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(stripDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'photobooth-strip.jpg', { type: 'image/jpeg' });

        await navigator.share({
          title: '90s Photobooth Strip',
          text: 'Check out my totally rad photobooth strip!',
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        downloadStrip(); // Fallback to download
      }
    } else {
      downloadStrip(); // Fallback to download
    }
  };

  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-3xl border-4 border-yellow-400 shadow-2xl">
        <h2 className="text-3xl font-black text-yellow-400 mb-6">
          YOUR TOTALLY RAD PHOTOS! 📸
        </h2>

        {/* Photo Strip Preview */}
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            {stripDataUrl && (
              <img
                src={stripDataUrl}
                alt="Photo Strip"
                className="max-w-xs mx-auto rounded-lg shadow-md"
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadStrip}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl transform transition-all duration-200 hover:scale-105 hover:rotate-1 hover:shadow-xl active:scale-95 border-3 border-yellow-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-green-300 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Download className="w-6 h-6" />
              DOWNLOAD STRIP
            </div>
          </button>

          <button
            onClick={shareStrip}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xl rounded-xl transform transition-all duration-200 hover:scale-105 hover:-rotate-1 hover:shadow-xl active:scale-95 border-3 border-yellow-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-blue-300 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2">
              <Share2 className="w-6 h-6" />
              SHARE STRIP
            </div>
          </button>
        </div>

        <div className="mt-6 text-yellow-200">
          <p className="text-lg font-semibold">
            🌟 Your memories are ready to rock! 🌟
          </p>
          <p className="text-sm mt-2">
            Share your totally rad photos with friends!
          </p>
        </div>
      </div>

      {/* Hidden canvas for strip generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoStrip;