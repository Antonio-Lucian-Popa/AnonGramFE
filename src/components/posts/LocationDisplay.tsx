import React, { useEffect, useState } from 'react';
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
  // const formatCoordinate = (coord: number): string => {
  //   return coord.toFixed(6);
  // };

  const [locationName, setLocationName] = useState<string | null>(null);

  // TODO: In a production app, we could use a mapping service
  // to reverse-geocode and get a human-readable location name

  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || '';
        const country = data.address.country || '';
        setLocationName(`${city}, ${country}`);
      } catch (error) {
        console.error('Error fetching location name:', error);
        setLocationName(null);
      }
    };

    fetchLocationName();
  }, [latitude, longitude]);
  
  return (
    <div className="bg-blue-900/30 rounded-lg p-3 flex items-center gap-2 text-blue-300">
      <MapPin className="h-5 w-5 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium">Posted from location:</p>
        <p className="text-xs">
        {locationName 
            ? locationName 
            : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
        </p>
      </div>
    </div>
  );
};