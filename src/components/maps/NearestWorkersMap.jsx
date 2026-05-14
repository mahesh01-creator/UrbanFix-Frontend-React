import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { IoLocationSharp } from 'react-icons/io5';
import { GOOGLE_MAPS_API_KEY } from '../../utils/constants';
import { calculateDistance } from '../../utils/helpers';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
};

const NearestWorkersMap = ({ 
  complaintLocation, 
  workers = [], 
  onWorkerSelect 
}) => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleWorkerClick = (worker) => {
    setSelectedWorker(worker);
  };

  const handleAssignWorker = (worker) => {
    if (onWorkerSelect) {
      onWorkerSelect(worker);
    }
    setSelectedWorker(null);
  };

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
      {/* Map */}
      <div className="glass rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={complaintLocation}
        >
          {/* Complaint Location Marker */}
          <Marker
            position={complaintLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            label={{
              text: '📍',
              fontSize: '24px',
            }}
          />

          {/* Worker Markers */}
          {workers.map((worker, index) => {
            const distance = calculateDistance(
              complaintLocation.lat,
              complaintLocation.lng,
              worker.latitude,
              worker.longitude
            );

            return (
              <Marker
                key={worker.id}
                position={{ lat: worker.latitude, lng: worker.longitude }}
                onClick={() => handleWorkerClick(worker)}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                label={{
                  text: `${index + 1}`,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              />
            );
          })}

          {/* Worker Info Window */}
          {selectedWorker && (
            <InfoWindow
              position={{ 
                lat: selectedWorker.latitude, 
                lng: selectedWorker.longitude 
              }}
              onCloseClick={() => setSelectedWorker(null)}
            >
              <div className="p-3 bg-gray-900 rounded-lg min-w-[250px]">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={selectedWorker.name} size="md" />
                  <div>
                    <p className="font-semibold text-white">{selectedWorker.name}</p>
                    <p className="text-xs text-gray-400">{selectedWorker.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-white font-semibold">
                      {calculateDistance(
                        complaintLocation.lat,
                        complaintLocation.lng,
                        selectedWorker.latitude,
                        selectedWorker.longitude
                      )} km
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Active Tasks:</span>
                    <span className="text-white font-semibold">
                      {selectedWorker.activeTasks || 0}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleAssignWorker(selectedWorker)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 
                           rounded-lg text-white font-semibold text-sm hover:shadow-lg 
                           transition-all"
                >
                  Assign This Worker
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>

      {/* Workers List */}
      <div className="glass rounded-xl p-4">
        <h4 className="font-semibold text-white mb-4">Nearest Workers</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {workers.map((worker, index) => {
            const distance = calculateDistance(
              complaintLocation.lat,
              complaintLocation.lng,
              worker.latitude,
              worker.longitude
            );

            return (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 glass-hover rounded-lg cursor-pointer"
                onClick={() => handleWorkerClick(worker)}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 
                                 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <Avatar name={worker.name} size="sm" />
                  <div>
                    <p className="font-semibold text-white text-sm">{worker.name}</p>
                    <p className="text-xs text-gray-400">
                      {distance} km away • {worker.activeTasks || 0} active tasks
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignWorker(worker);
                  }}
                >
                  Assign
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NearestWorkersMap;