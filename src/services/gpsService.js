import api from '../api/api';

const gpsService = {
  // Capture GPS from browser and send to backend
  // Call this once when DriverDashboard mounts
  captureAndSend: () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ success: false, reason: 'Geolocation not supported' });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await api.post('/driver/update-location', {
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            });
            resolve({ success: true, latitude, longitude });
          } catch (err) {
            resolve({ success: false, reason: err?.message || 'Request failed' });
          }
        },
        (error) => {
          resolve({ success: false, reason: error.message });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },
};

export default gpsService;
