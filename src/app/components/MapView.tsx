import { useState } from 'react';
import { Match } from '../App';
import { MapPin, Navigation, Crosshair, Users } from 'lucide-react';

interface MapViewProps {
  matches: Match[];
}

// San Francisco coordinates as default
const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

export function MapView({ matches }: MapViewProps) {
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [mapRadius, setMapRadius] = useState(10); // km

  const handleLocateMe = () => {
    // Simulate getting user location
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    setUserLocation({
      lat: DEFAULT_CENTER.lat + randomOffset(),
      lng: DEFAULT_CENTER.lng + randomOffset(),
    });
  };

  // Generate positions for matches around user
  const getMatchPosition = (index: number, totalMatches: number) => {
    const angle = (index / totalMatches) * 2 * Math.PI;
    const distance = 0.02 + Math.random() * 0.05;
    return {
      lat: userLocation.lat + Math.cos(angle) * distance,
      lng: userLocation.lng + Math.sin(angle) * distance,
    };
  };

  return (
    <div className="h-full relative bg-gray-100">
      {/* Map Container */}
      <div className="absolute inset-0">
        {/* Simulated Map Background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
          {/* Grid lines to simulate map */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* User location marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: '50%', top: '50%' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping" />
              <div className="size-16 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <Navigation className="size-8 text-white" />
              </div>
            </div>
          </div>

          {/* Radius circle */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 border-2 border-orange-300 rounded-full opacity-30"
            style={{
              left: '50%',
              top: '50%',
              width: `${mapRadius * 30}px`,
              height: `${mapRadius * 30}px`,
            }}
          />

          {/* Match markers */}
          {matches.map((match, index) => {
            const pos = getMatchPosition(index, matches.length);
            const offsetX = ((pos.lng - userLocation.lng) / 0.1) * 50 + 50;
            const offsetY = ((userLocation.lat - pos.lat) / 0.1) * 50 + 50;

            return (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 hover:z-30 transition-all hover:scale-110"
                style={{
                  left: `${offsetX}%`,
                  top: `${offsetY}%`,
                }}
              >
                <div className="relative">
                  {selectedMatch?.id === match.id && (
                    <div className="absolute inset-0 bg-orange-500 rounded-full opacity-30 animate-pulse" />
                  )}
                  <div className="size-14 rounded-full border-3 border-white shadow-lg overflow-hidden">
                    <img
                      src={match.profile.photos[0]}
                      alt={match.profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {match.profile.distance}km
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
          <Users className="size-5 text-orange-500" />
          <span className="text-sm">{matches.length} nearby</span>
        </div>
        <button
          onClick={handleLocateMe}
          className="bg-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Crosshair className="size-5 text-gray-700" />
        </button>
      </div>

      {/* Radius Control */}
      <div className="absolute top-20 right-4 bg-white rounded-2xl p-4 shadow-lg z-30">
        <p className="text-sm text-gray-600 mb-2">Search Radius</p>
        <input
          type="range"
          min="1"
          max="50"
          value={mapRadius}
          onChange={(e) => setMapRadius(Number(e.target.value))}
          className="w-32"
        />
        <p className="text-sm text-orange-500 mt-1 text-center">{mapRadius} km</p>
      </div>

      {/* Selected Match Info */}
      {selectedMatch && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 z-30">
          <button
            onClick={() => setSelectedMatch(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <div className="flex items-start gap-4">
            <div className="size-20 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={selectedMatch.profile.photos[0]}
                alt={selectedMatch.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">{selectedMatch.profile.name}</h3>
                <span className="text-gray-600">{selectedMatch.profile.age}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <MapPin className="size-4" />
                <span>{selectedMatch.profile.distance} km away</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {selectedMatch.profile.bio}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full px-4 py-2 shadow-lg z-20">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <span className="text-sm">Exploring nearby</span>
        </div>
      </div>
    </div>
  );
}
