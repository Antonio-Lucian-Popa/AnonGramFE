import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
}

export const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  latitude, 
  longitude 
}) => {
  // Format coordinates to be more readable
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  // TODO: In a production app, we could use a mapping service
  // to reverse-geocode and get a human-readable location name
  
  return (
    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2 text-blue-300">
      <MapPin className="h-5 w-5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">Posted from location:</p>
        <p className="text-xs">
          {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
        </p>
      </div>
    </div>
  );
};