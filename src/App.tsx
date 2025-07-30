import React, { useState } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import CameraCapture from './components/CameraCapture';
import PhotoStrip from './components/PhotoStrip';
import ConfigPanel from './components/ConfigPanel';

function App() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoCount, setPhotoCount] = useState(4);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handlePhotosComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setIsCapturing(false);
    setShowCamera(false);
  };

  const startPhotoshoot = () => {
    setShowCamera(true);
    setIsCapturing(true);
    setPhotos([]);
  };

  const retakePhotos = () => {
    setPhotos([]);
    startPhotoshoot();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-pink-400 rotate-12 animate-spin" style={{animationDuration: '3s'}}></div>
        <div className="absolute bottom-32 right-16 w-14 h-14 bg-purple-400 transform skew-x-12 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 drop-shadow-lg tracking-wider transform -skew-x-6 mb-4">
            PHOTOBOOTH
          </h1>
          <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg transform skew-x-3">
            ✨ TOTALLY RAD ✨
          </div>
          <div className="mt-2 text-lg text-yellow-300 font-semibold">
            90s VIBES ONLY!
          </div>
        </div>

        {!showCamera && photos.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <ConfigPanel 
              photoCount={photoCount}
              onPhotoCountChange={setPhotoCount}
            />
            
            <div className="text-center mt-8">
              <button
                onClick={startPhotoshoot}
                className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-2xl rounded-2xl transform transition-all duration-200 hover:scale-105 hover:rotate-1 hover:shadow-2xl active:scale-95 border-4 border-yellow-400"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Camera className="w-8 h-8" />
                  START PHOTOSHOOT!
                </div>
              </button>
            </div>
          </div>
        )}

        {showCamera && (
          <CameraCapture
            photoCount={photoCount}
            onPhotosComplete={handlePhotosComplete}
            onCancel={() => {
              setShowCamera(false);
              setIsCapturing(false);
            }}
          />
        )}

        {photos.length > 0 && !showCamera && (
          <div className="max-w-4xl mx-auto">
            <PhotoStrip photos={photos} />
            
            <div className="text-center mt-8">
              <button
                onClick={retakePhotos}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-xl transform transition-all duration-200 hover:scale-105 hover:-rotate-1 hover:shadow-xl active:scale-95 border-3 border-yellow-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6" />
                  RETAKE PHOTOS
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-yellow-400 via-pink-500 via-cyan-400 to-purple-500"></div>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-r from-purple-500 via-cyan-400 via-pink-500 to-yellow-400"></div>
    </div>
  );
}

export default App;