import { useState } from "react";
import { sosAPI } from "../lib/api";
import { notificationService } from "../services/notificationService";
import toast from "react-hot-toast";

export const useSOS = () => {
  const [loading, setLoading] = useState(false);

  const createSOS = async (sosData) => {
    setLoading(true);
    try {
      const data = await sosAPI.create(sosData);
      toast.success("SOS sent successfully! Help is on the way.");
      notificationService.notifyNewSOS(sosData);
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to send SOS. Please try again.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMySOS = async (page = 1, limit = 10) => {
    try {
      const data = await sosAPI.getMyRequests({ page, limit });
      return {
        items: data.items || [],
        pagination: data.pagination || { page, limit, total: 0, pages: 0 }
      };
    } catch (error) {
      const errorMessage = error.message || "Failed to load your SOS requests.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getNearbySOS = async (lat, lng, maxDistance = 10000) => {
    try {
      const data = await sosAPI.getNearby(lat, lng, maxDistance);
      return {
        items: data.items || [],
        count: data.count || 0,
        searchLocation: data.searchLocation || { lat, lng },
        maxDistance: data.maxDistance || maxDistance
      };
    } catch (error) {
      const errorMessage = error.message || "Failed to load nearby SOS requests.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const acceptSOS = async (sosId) => {
    try {
      const data = await sosAPI.accept(sosId);
      toast.success("SOS request accepted successfully!");
      notificationService.notifySOSAccepted(
        data.sos, 
        data.acceptedBy?.name || 'A volunteer'
      );
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to accept SOS request.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSOSStatus = async (sosId, status) => {
    try {
      const data = await sosAPI.updateStatus(sosId, status);
      toast.success(`Status updated to ${status}`);
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update status.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getSOSDetails = async (sosId) => {
    try {
      const data = await sosAPI.getDetails(sosId);
      return data.sos;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch SOS details.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Additional utility function for getting current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          });
        },
        (error) => {
          let errorMessage = "Failed to get your location";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location services in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is currently unavailable. Please check your network connection.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unexpected error occurred while getting your location.";
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        }
      );
    });
  };

  // Helper function to create SOS with automatic location
  const createSOSWithLocation = async (type = "Emergency", description = "") => {
    try {
      const location = await getCurrentLocation();
      const sosData = {
        type,
        description: description || `I need immediate ${type.toLowerCase()} assistance`,
        location: {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy
        },
        metadata: {
          altitude: location.altitude,
          heading: location.heading,
          speed: location.speed,
          timestamp: location.timestamp
        }
      };
      
      return await createSOS(sosData);
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Quick emergency SOS with default settings
  const sendQuickEmergency = async () => {
    return createSOSWithLocation("Emergency", "I need immediate help!");
  };

  // Batch operations
  const getSOSStats = async () => {
    try {
      const mySOS = await getMySOS(1, 100); // Get all SOS for stats
      
      const stats = {
        total: mySOS.items.length,
        pending: mySOS.items.filter(sos => sos.status === "Pending").length,
        inProgress: mySOS.items.filter(sos => sos.status === "In Progress").length,
        resolved: mySOS.items.filter(sos => sos.status === "Resolved").length,
        cancelled: mySOS.items.filter(sos => sos.status === "Cancelled").length
      };

      return stats;
    } catch (error) {
      console.error("Failed to get SOS stats:", error);
      return {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        cancelled: 0
      };
    }
  };

  return {
    loading,
    createSOS,
    createSOSWithLocation,
    sendQuickEmergency,
    getMySOS,
    getNearbySOS,
    getSOSDetails,
    acceptSOS,
    updateSOSStatus,
    getCurrentLocation,
    getSOSStats
  };
};