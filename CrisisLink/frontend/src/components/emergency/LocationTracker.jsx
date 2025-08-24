import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { LocationOn, LocationOff, MyLocation } from '@mui/icons-material';
import api from '../../services/api';

const LocationTracker = () => {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [tracking]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setTracking(false);
      return;
    }

    setLoading(true);
    
    // Get initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position);
        setLoading(false);
      },
      (error) => {
        handleLocationError(error);
        setLoading(false);
        setTracking(false);
      }
    );

    // Set up continuous tracking
    const watchId = navigator.geolocation.watchPosition(
      updateLocation,
      handleLocationError,
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    localStorage.setItem('locationWatchId', watchId);
  };

  const stopLocationTracking = () => {
    const watchId = localStorage.getItem('locationWatchId');
    if (watchId) {
      navigator.geolocation.clearWatch(parseInt(watchId));
      localStorage.removeItem('locationWatchId');
    }
  };

  const updateLocation = async (position) => {
    const newLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp)
    };

    setLocation(newLocation);

    // Send to backend
    try {
      await api.post('/location/update', {
        longitude: newLocation.longitude,
        latitude: newLocation.latitude
      });
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleLocationError = (error) => {
    console.error('Location error:', error);
    let errorMessage = 'Unknown error occurred';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location permissions.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
      default:
        errorMessage = 'Unknown error occurred';
    }
    
    setError(errorMessage);
    setTracking(false);
  };

  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position);
        setLoading(false);
      },
      (error) => {
        handleLocationError(error);
        setLoading(false);
      }
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">
          <LocationOn sx={{ mr: 1, verticalAlign: 'bottom' }} />
          Live Location Tracking
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={tracking}
              onChange={(e) => setTracking(e.target.checked)}
              color="primary"
            />
          }
          label={tracking ? 'Tracking ON' : 'Tracking OFF'}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {location && (
        <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Current Location:</strong>
          </Typography>
          <Typography variant="body2">
            Latitude: {location.latitude.toFixed(6)}
          </Typography>
          <Typography variant="body2">
            Longitude: {location.longitude.toFixed(6)}
          </Typography>
          <Typography variant="body2">
            Accuracy: ±{location.accuracy.toFixed(2)} meters
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Last updated: {location.timestamp.toLocaleTimeString()}
          </Typography>
        </Box>
      )}

      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={16} /> : <MyLocation />}
          onClick={getCurrentLocation}
          disabled={loading}
        >
          {loading ? 'Getting Location...' : 'Get Current Location'}
        </Button>
        
        <Button
          variant="outlined"
          color={tracking ? 'error' : 'primary'}
          onClick={() => setTracking(!tracking)}
          startIcon={tracking ? <LocationOff /> : <LocationOn />}
        >
          {tracking ? 'Stop Tracking' : 'Start Tracking'}
        </Button>
      </Box>

      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        {tracking 
          ? 'Your location is being shared with emergency services' 
          : 'Enable to share your location during emergencies'
        }
      </Typography>
    </Paper>
  );
};

export default LocationTracker;