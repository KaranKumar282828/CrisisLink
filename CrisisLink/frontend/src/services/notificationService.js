import toast from 'react-hot-toast';

class NotificationService {
  constructor() {
    this.permission = null;
    this.init();
  }

  async init() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      if (this.permission === 'default') {
        this.permission = await Notification.requestPermission();
      }
    }
  }

  showLocalNotification(title, options = {}) {
    if (this.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        ...options
      });
    } else {
      // Fallback to toast notifications
      toast.success(title);
    }
  }

  // SOS-specific notifications
  notifyNewSOS(sosData) {
    this.showLocalNotification('🚨 New Emergency Alert', {
      body: `${sosData.type} emergency nearby - ${sosData.description || 'Needs immediate assistance'}`,
      tag: 'sos-alert',
      requireInteraction: true
    });
  }

  notifySOSAccepted(sosData, volunteerName) {
    this.showLocalNotification('✅ Help is on the way!', {
      body: `${volunteerName} is responding to your emergency request`,
      tag: 'sos-accepted'
    });
  }

  notifyVolunteerArrived(volunteerName) {
    this.showLocalNotification('👋 Volunteer Arrived', {
      body: `${volunteerName} has arrived at your location`,
      tag: 'volunteer-arrived'
    });
  }

  // System notifications
  notifyConnectionStatus(isConnected) {
    const message = isConnected ? 'Realtime connection established' : 'Connection lost - working offline';
    this.showLocalNotification('🔌 Connection Update', {
      body: message,
      tag: 'connection-status'
    });
  }

  notifyLocationUpdate() {
    this.showLocalNotification('📍 Location Updated', {
      body: 'Your location has been shared with nearby volunteers',
      tag: 'location-update'
    });
  }
}

export const notificationService = new NotificationService();