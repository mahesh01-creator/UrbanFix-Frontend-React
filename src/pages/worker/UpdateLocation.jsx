// src/pages/worker/UpdateLocation.jsx

import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { motion } from "framer-motion";

import {
  IoLocationSharp,
  IoNavigateCircleOutline,
  IoCheckmarkCircle,
  IoWarningOutline,
  IoSparklesOutline,
  IoTimeOutline,
} from "react-icons/io5";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import WorkerLayout from "../../components/layout/WorkerLayout";

import { complaintService } from "../../services/complaintService";

import { useAuthStore } from "../../store/authStore";

import { GOOGLE_MAPS_API_KEY } from "../../utils/constants";

import toast from "react-hot-toast";

const mapContainerStyle = {
  width: "100%",
  height: "520px",
  borderRadius: "28px",
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
};

const UpdateLocation = () => {
  const { user, updateUser } =
    useAuthStore();

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [selectedAddress, setSelectedAddress] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [lastUpdate, setLastUpdate] =
    useState(null);

  const [autoUpdate, setAutoUpdate] =
    useState(
      localStorage.getItem(
        "workerAutoTracking"
      ) === "true"
    );

  const [trackingStatus, setTrackingStatus] =
    useState(
      localStorage.getItem(
        "workerTrackingStatus"
      ) || "OFFLINE"
    );

  const { isLoaded, loadError } =
    useJsApiLoader({
      googleMapsApiKey:
        GOOGLE_MAPS_API_KEY,
    });

  // =========================
  // GET ADDRESS FROM LAT LNG
  // =========================

  const getAddressFromCoordinates =
    useCallback(
      (lat, lng) => {
        if (
          !window.google ||
          !window.google.maps ||
          !window.google.maps.Geocoder
        ) {
          return;
        }

        const geocoder =
          new window.google.maps.Geocoder();

        geocoder.geocode(
          {
            location: {
              lat,
              lng,
            },
          },
          (results, status) => {
            if (
              status === "OK" &&
              results &&
              results[0]
            ) {
              setSelectedAddress(
                results[0]
                  .formatted_address
              );
            } else {
              setSelectedAddress(
                `${lat.toFixed(
                  6
                )}, ${lng.toFixed(6)}`
              );
            }
          }
        );
      },
      []
    );

  // =========================
  // LOAD USER LOCATION
  // =========================

  useEffect(() => {
    if (
      isLoaded &&
      user?.latitude &&
      user?.longitude
    ) {
      const lat = Number(
        user.latitude
      );

      const lng = Number(
        user.longitude
      );

      setCurrentLocation({
        lat,
        lng,
      });

      getAddressFromCoordinates(
        lat,
        lng
      );

      setTrackingStatus("ONLINE");
    }
  }, [
    isLoaded,
    user,
    getAddressFromCoordinates,
  ]);

  // =========================
  // AUTO UPDATE
  // =========================

  useEffect(() => {
    let interval;

    if (autoUpdate) {
      interval = setInterval(() => {
        handleGetCurrentLocation(
          true
        );
      }, 30000);
    }

    return () => {
      if (interval)
        clearInterval(interval);
    };
  }, [autoUpdate]);

  // =========================
  // GET CURRENT LOCATION
  // =========================

  const handleGetCurrentLocation =
    async (silent = false) => {
      if (!navigator.geolocation) {
        toast.error(
          "Geolocation not supported"
        );
        return;
      }

      if (!silent) {
        toast.loading(
          "Detecting location..."
        );
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          setCurrentLocation({
            lat,
            lng,
          });

          getAddressFromCoordinates(
            lat,
            lng
          );

          toast.dismiss();

          if (!silent) {
            toast.success(
              "Location detected"
            );
          }

          if (
            autoUpdate ||
            silent
          ) {
            await saveLocation(
              lat,
              lng,
              true
            );
          }
        },

        () => {
          toast.dismiss();

          setTrackingStatus(
            "OFFLINE"
          );

          localStorage.setItem(
            "workerTrackingStatus",
            "OFFLINE"
          );

          if (!silent) {
            toast.error(
              "Failed to fetch location"
            );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

  // =========================
  // SAVE LOCATION
  // =========================

  const saveLocation = async (
    lat,
    lng,
    silent = false
  ) => {
    try {
      setUpdating(true);

      await complaintService.updateWorkerLocation(
        user.id,
        lat,
        lng
      );

      updateUser({
        latitude: lat,
        longitude: lng,
      });

      setLastUpdate(new Date());

      setTrackingStatus("ONLINE");

      localStorage.setItem(
        "workerTrackingStatus",
        "ONLINE"
      );

      if (!silent) {
        toast.success(
          "Location updated successfully 📍"
        );
      }
    } catch (error) {
      console.error(error);

      setTrackingStatus(
        "OFFLINE"
      );

      localStorage.setItem(
        "workerTrackingStatus",
        "OFFLINE"
      );

      if (!silent) {
        toast.error(
          "Failed to update location"
        );
      }
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // SAVE BUTTON
  // =========================

  const handleSaveLocation =
    async () => {
      if (!currentLocation) {
        toast.error(
          "Please select location first"
        );
        return;
      }

      await saveLocation(
        currentLocation.lat,
        currentLocation.lng
      );
    };

  // =========================
  // MAP CLICK
  // =========================

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();

    const lng = e.latLng.lng();

    setCurrentLocation({
      lat,
      lng,
    });

    getAddressFromCoordinates(
      lat,
      lng
    );

    toast.success(
      "Location selected"
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        Failed to load Google Maps
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <Loader
        fullScreen
        text="Loading Smart Location System..."
      />
    );
  }

  const center =
    currentLocation ||
    defaultCenter;

  return (
    <WorkerLayout>
      <div className="space-y-8">
        {/* HERO */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="relative overflow-hidden rounded-[32px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 p-8"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-6">
              <IoSparklesOutline />
              Smart GPS Tracking
            </div>

            <h1 className="text-5xl font-black">
              Live Worker Location
            </h1>

            <p className="text-gray-300 mt-5 max-w-3xl text-lg">
              Update your live
              location for smarter
              nearby complaint
              assignments.
            </p>
          </div>
        </motion.div>

        {/* STATUS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-cyan-500/10 border border-cyan-500/20 rounded-[28px] p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
                <IoLocationSharp className="text-3xl text-cyan-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Status
                </p>

                <h2 className="text-2xl font-black mt-1">
                  {currentLocation
                    ? "Location Active"
                    : "Not Set"}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="bg-green-500/10 border border-green-500/20 rounded-[28px] p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <IoCheckmarkCircle className="text-3xl text-green-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Last Update
                </p>

                <h2 className="text-xl font-black mt-1">
                  {lastUpdate
                    ? new Date(
                        lastUpdate
                      ).toLocaleTimeString()
                    : "Never"}
                </h2>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-500/10 border border-purple-500/20 rounded-[28px] p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <IoNavigateCircleOutline className="text-3xl text-purple-400" />
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Auto Tracking
                </p>

                <h2 className="text-2xl font-black mt-1">
                  {autoUpdate
                    ? "Enabled"
                    : "Disabled"}
                </h2>
              </div>
            </div>
          </Card>
        </div>

        {/* MAP */}

        <Card className="bg-white/[0.04] border border-white/10 rounded-[32px] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-black">
                Live Map Tracking
              </h2>

              <p className="text-gray-400 mt-1">
                Detect or manually
                select location
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() =>
                  handleGetCurrentLocation()
                }
                icon={IoLocationSharp}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                Current Location
              </Button>

              <Button
                onClick={
                  handleSaveLocation
                }
                loading={updating}
                disabled={
                  !currentLocation
                }
                icon={
                  IoCheckmarkCircle
                }
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10">
            <GoogleMap
              mapContainerStyle={
                mapContainerStyle
              }
              center={center}
              zoom={15}
              onClick={
                handleMapClick
              }
            >
              {currentLocation && (
                <Marker
                  position={
                    currentLocation
                  }
                />
              )}
            </GoogleMap>
          </div>

          {currentLocation && (
            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <p className="text-cyan-300 text-sm font-semibold mb-2">
                Selected Address
              </p>

              <h3 className="text-lg font-bold leading-relaxed">
                {selectedAddress ||
                  "Fetching address..."}
              </h3>
            </div>
          )}
        </Card>

        {/* BOTTOM GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-yellow-500/10 border border-yellow-500/20 rounded-[32px] p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <IoWarningOutline className="text-3xl text-yellow-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  Privacy Notice
                </h3>

                <p className="text-gray-300 leading-relaxed">
                  Your location is
                  securely used only
                  for smart complaint
                  assignment.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-purple-500/10 border border-purple-500/20 rounded-[32px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Tracking Status
                </p>

                <h2
                  className={`text-3xl font-black mt-2 ${
                    trackingStatus ===
                    "ONLINE"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trackingStatus}
                </h2>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <IoTimeOutline className="text-3xl text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </WorkerLayout>
  );
};

export default UpdateLocation;