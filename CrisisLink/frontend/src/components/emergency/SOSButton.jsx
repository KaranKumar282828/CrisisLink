import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Emergency, LocationOn, Warning } from '@mui/icons-material';
import api from '../../services/api';
import './SOSButton.css';

const SOSButton = () => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [location, setLocation] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000 }
      );
    });
  };

  const triggerSOS = async () => {
    setLoading(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      setLocation(location);

      // Show confirmation dialog
      setConfirmOpen(true);

    } catch (error) {
      console.error('Location error:', error);
      alert('Location access failed. Please enable location services.');
    }
    setLoading(false);
  };

  const confirmSOS = async () => {
    setLoading(true);
    try {
      const response = await api.post('/alerts/sos', {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (response.data.success) {
        alert('🚨 Emergency alert sent! Help is on the way.');
        // Here you can trigger sound, notification, etc.
      }

    } catch (error) {
      console.error('SOS error:', error);
      alert('Failed to send emergency alert. Please try again.');
    }
    setLoading(false);
    setConfirmOpen(false);
  };

  return (
    <div className="sos-container">
      <Button
        variant="contained"
        className="sos-button"
        onClick={triggerSOS}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <Emergency />}
      >
        {loading ? 'SENDING SOS...' : '🚨 EMERGENCY SOS'}
      </Button>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          <Warning color="error" /> Confirm Emergency Alert
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to send an emergency alert?
          </Typography>
          {location && (
            <Typography variant="body2" color="textSecondary">
              <LocationOn fontSize="small" />
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Typography>
          )}
          <Typography variant="caption" color="error">
            This will notify emergency services and nearby volunteers.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmSOS} color="error" variant="contained">
            Confirm SOS
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SOSButton;