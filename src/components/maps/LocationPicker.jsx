import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5';
import { GOOGLE_MAPS_API_KEY, DEFAULT_CENTER } from '../../utils/constants';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const LIBRARIES = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// Free alternative geocoding using Nominatim (OpenStreetMap)
const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

const forwardGeocode = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1&limit=1`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        address: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || DEFAULT_CENTER
  );
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const onMapClick = useCallback(async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    setLoading(true);

    // Get address using free geocoding
    const addr = await reverseGeocode(lat, lng);
    setAddress(addr);
    setLoading(false);

    if (onLocationSelect) {
      onLocationSelect({ lat, lng, address: addr });
    }
  }, [onLocationSelect]);

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setSelectedLocation({ lat, lng });
        setLoading(true);

        // Get address using free geocoding
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        setLoading(false);

        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address: addr });
        }

        toast.dismiss();
        toast.success('Location detected!');
      },
      (error) => {
        toast.dismiss();
        toast.error('Unable to get your location. Please select manually on the map.');
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setLoading(true);
    toast.loading('Searching location...');

    const result = await forwardGeocode(searchQuery);
    
    toast.dismiss();
    setLoading(false);

    if (result) {
      setSelectedLocation({ lat: result.lat, lng: result.lng });
      setAddress(result.address);

      if (onLocationSelect) {
        onLocationSelect({ 
          lat: result.lat, 
          lng: result.lng, 
          address: result.address 
        });
      }

      toast.success('Location found!');
    } else {
      toast.error('Location not found. Try being more specific.');
    }
  };

  if (loadError) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-red-400">Error loading maps. Please check your API key.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="glass rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a location (e.g., Shivaji Nagar, Delhi)"
              className="input-glass pl-12"
              disabled={loading}
            />
          </div>
          <Button 
            onClick={handleSearch} 
            variant="primary"
            loading={loading}
          >
            Search
          </Button>
          <Button 
            onClick={handleGetCurrentLocation} 
            variant="secondary"
            icon={IoLocationSharp}
            loading={loading}
          >
            Current Location
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="glass rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={selectedLocation}
          options={mapOptions}
          onClick={onMapClick}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              animation={window.google.maps.Animation.DROP}
            />
          )}
        </GoogleMap>
      </div>

      {/* Selected Location Info - FIXED TO SHOW ADDRESS */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg flex-shrink-0">
              <IoLocationSharp className="w-6 h-6 text-primary-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Selected Location</h4>
              
              {/* Show Address Instead of Lat/Lon */}
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Getting address...</p>
                </div>
              ) : (
                <p className="text-sm text-gray-300 mb-2">
                  {address || 'Click on the map to select a location'}
                </p>
              )}
              
              {/* Show Coordinates in Small Text */}
              <div className="flex gap-4 text-xs text-gray-500">
                <span>📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="glass rounded-xl p-4 border border-blue-500/30">
        <p className="text-sm text-blue-400 flex items-center gap-2">
          <span>💡</span>
          <span>Click anywhere on the map to select location or use the search bar</span>
        </p>
      </div>
    </motion.div>
  );
};

export default LocationPicker;