import React from 'react';
import { Camera, Settings } from 'lucide-react';

interface ConfigPanelProps {
  photoCount: number;
  onPhotoCountChange: (count: number) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  photoCount,
  onPhotoCountChange
}) => {
  const photoOptions = [3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-purple-700 p-6 rounded-3xl border-4 border-yellow-400 shadow-2xl">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-yellow-400" />
        <h2 className="text-3xl font-black text-white">PHOTO SETTINGS</h2>
      </div>

      <div className="text-center mb-6">
        <label className="block text-xl font-bold text-yellow-300 mb-4">
          HOW MANY PHOTOS?
        </label>
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {photoOptions.map((count) => (
            <button
              key={count}
              onClick={() => onPhotoCountChange(count)}
              className={`
                w-16 h-16 rounded-xl font-black text-xl transition-all duration-200 
                border-3 transform hover:scale-110 active:scale-95
                ${photoCount === count
                  ? 'bg-yellow-400 text-purple-800 border-yellow-400 shadow-lg scale-110'
                  : 'bg-white bg-opacity-20 text-white border-white hover:bg-opacity-30'
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-bold border-2 border-yellow-300">
          <Camera className="w-5 h-5" />
          <span>{photoCount} PHOTOS SELECTED</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-yellow-200">
          📸 Each photo has a 3-second timer<br />
          ⚡ Perfect for group shots and selfies!
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;