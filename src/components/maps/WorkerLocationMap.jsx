import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { IoLocationSharp, IoPersonOutline, IoNavigateOutline } from 'react-icons/io5';
import { GOOGLE_MAPS_API_KEY } from '../../utils/constants';
import { calculateDistance } from '../../utils/helpers';
import Avatar from '../common/Avatar';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

const WorkerLocationMap = ({ 
  workerLocation, 
  complaintLocation, 
  workerInfo,
  showRoute = false 
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [distance, setDistance] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['geometry'],
  });

  useEffect(() => {
    if (workerLocation && complaintLocation) {
      const dist = calculateDistance(
        workerLocation.lat,
        workerLocation.lng,
        complaintLocation.lat,
        complaintLocation.lng
      );
      setDistance(dist);
    }
  }, [workerLocation, complaintLocation]);

  const center = workerLocation || complaintLocation || { lat: 28.6139, lng: 77.2090 };

  const pathCoordinates = showRoute && workerLocation && complaintLocation
    ? [
        { lat: workerLocation.lat, lng: workerLocation.lng },
        { lat: complaintLocation.lat, lng: complaintLocation.lng },
      ]
    : [];

  if (loadError) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-red-400">Error loading maps</p>
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
    <div className="space-y-4">
      {/* Distance Info */}
      {distance && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <IoNavigateOutline className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Distance to Complaint</p>
              <p className="text-2xl font-bold text-white">{distance} km</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Estimated Time</p>
            <p className="text-lg font-semibold text-green-400">
              ~{Math.ceil(parseFloat(distance) * 3)} min
            </p>
          </div>
        </motion.div>
      )}

      {/* Map */}
      <div className="glass rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
          options={mapOptions}
        >
          {/* Worker Marker */}
          {workerLocation && (
            <Marker
              position={{ lat: workerLocation.lat, lng: workerLocation.lng }}
              onClick={() => setSelectedMarker('worker')}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              animation={window.google.maps.Animation.BOUNCE}
            />
          )}

          {/* Complaint Marker */}
          {complaintLocation && (
            <Marker
              position={{ lat: complaintLocation.lat, lng: complaintLocation.lng }}
              onClick={() => setSelectedMarker('complaint')}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(50, 50),
              }}
            />
          )}

          {/* Route Polyline */}
          {showRoute && pathCoordinates.length > 0 && (
            <Polyline
              path={pathCoordinates}
              options={{
                strokeColor: '#3b82f6',
                strokeOpacity: 0.8,
                strokeWeight: 4,
                geodesic: true,
              }}
            />
          )}

          {/* Worker Info Window */}
          {selectedMarker === 'worker' && workerLocation && (
            <InfoWindow
              position={{ lat: workerLocation.lat, lng: workerLocation.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 bg-gray-900 rounded-lg min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={workerInfo?.name} size="sm" />
                  <div>
                    <p className="font-semibold text-white">{workerInfo?.name || 'Worker'}</p>
                    <p className="text-xs text-gray-400">Current Location</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Lat: {workerLocation.lat.toFixed(6)}</p>
                  <p>Lng: {workerLocation.lng.toFixed(6)}</p>
                </div>
              </div>
            </InfoWindow>
          )}

          {/* Complaint Info Window */}
          {selectedMarker === 'complaint' && complaintLocation && (
            <InfoWindow
              position={{ lat: complaintLocation.lat, lng: complaintLocation.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 bg-gray-900 rounded-lg">
                <p className="font-semibold text-white mb-1">Complaint Location</p>
                <p className="text-xs text-gray-400 mb-2">Target destination</p>
                <div className="text-xs text-gray-500">
                  <p>Lat: {complaintLocation.lat.toFixed(6)}</p>
                  <p>Lng: {complaintLocation.lng.toFixed(6)}</p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Legend */}
      <div className="glass rounded-xl p-4">
        <h4 className="font-semibold text-white mb-3">Map Legend</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Worker Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-400">Complaint Location</span>
          </div>
          {showRoute && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-blue-500"></div>
              <span className="text-sm text-gray-400">Route</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerLocationMap;