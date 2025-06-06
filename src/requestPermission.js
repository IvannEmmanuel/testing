// src/requestPermission.js
import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: 'BC2amr5RIbgoxXr84BqkcfVYcahw3iYkeB_VULfJTSboGOH0vuTlPQDaGI244T4YLsBH1xNQpW7twHhjXaIzoDA', // from Firebase Cloud Messaging settings
      });

      if (currentToken) {
        console.log('✅ FCM Token:', currentToken);
        // ✅ You can send this token to your backend or Supabase for later use
      } else {
        console.log('⚠️ No registration token available.');
      }
    } else {
      console.log('🚫 Notification permission denied.');
    }
  } catch (err) {
    console.error('❌ An error occurred while retrieving token:', err);
  }
};

export default requestPermission;