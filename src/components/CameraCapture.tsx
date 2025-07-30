import React, { useRef, useEffect, useState } from 'react';
import { X, Camera } from 'lucide-react';
import Timer from './Timer';

interface CameraCaptureProps {
  photoCount: number;
  onPhotosComplete: (photos: string[]) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  photoCount,
  onPhotosComplete,
  onCancel
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (capturedPhotos.length === photoCount) {
      onPhotosComplete(capturedPhotos);
    }
  }, [capturedPhotos, photoCount, onPhotosComplete]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      // Start first timer after camera is ready
      setTimeout(() => {
        setIsTimerActive(true);
      }, 1000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setPermissionDenied(true);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip the image horizontally (mirror effect)
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.scale(-1, 1);

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const newPhotos = [...capturedPhotos, photoDataUrl];
    setCapturedPhotos(newPhotos);
    setCurrentPhotoIndex(prev => prev + 1);

    // Flash effect
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 200);

    // Start next timer if more photos needed
    if (newPhotos.length < photoCount) {
      setTimeout(() => {
        setIsTimerActive(true);
      }, 1000);
    }
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
    capturePhoto();
  };

  const handleCancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  if (permissionDenied) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-8 rounded-3xl border-4 border-yellow-400 shadow-2xl">
          <h2 className="text-3xl font-black text-white mb-4">CAMERA BLOCKED! 📷</h2>
          <p className="text-xl text-yellow-100 mb-6">
            We need camera access to take your totally rad photos!
          </p>
          <p className="text-lg text-yellow-200 mb-6">
            Please allow camera permission and refresh the page.
          </p>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-white text-red-500 font-bold rounded-xl hover:bg-yellow-100 transition-colors"
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-3xl border-4 border-yellow-400 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-black text-yellow-400">
            PHOTO {currentPhotoIndex + 1} OF {photoCount}
          </div>
          <button
            onClick={handleCancel}
            className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Preview */}
        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full max-w-2xl mx-auto rounded-2xl border-4 border-cyan-400 shadow-lg transform transition-all duration-200 ${
              isCapturing ? 'brightness-200 scale-105' : ''
            }`}
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Flash overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white opacity-80 rounded-2xl"></div>
          )}

          {/* Timer overlay */}
          {isTimerActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
              <Timer onComplete={handleTimerComplete} />
            </div>
          )}
        </div>

        {/* Photo progress */}
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: photoCount }).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                index < capturedPhotos.length
                  ? 'bg-green-400 border-green-400 animate-pulse'
                  : index === currentPhotoIndex
                  ? 'bg-yellow-400 border-yellow-400 animate-bounce'
                  : 'bg-gray-600 border-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center">
          <div className="text-xl font-bold text-cyan-300 mb-2">
            {isTimerActive ? 'GET READY!' : 'STRIKE A POSE!'}
          </div>
          <div className="text-lg text-yellow-200">
            {isTimerActive 
              ? 'Photo coming up...' 
              : `${photoCount - capturedPhotos.length} photos left to capture`
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;