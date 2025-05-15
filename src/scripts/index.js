import '../styles/styles.css';
import App from './pages/app';
import Camera from './utils/camera'; 

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for(let i=0; i<rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUserToPush(registration) {
  if (!registration.pushManager) {
    console.log('Push manager tidak tersedia');
    return;
  }

  try {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Izin notifikasi tidak diberikan');
        return;
      }
    }

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    if (!subscription.getKey) {
      console.error('Subscription keys tidak ada, abort subscribe ke server');
      return;
    }

    function arrayBufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      bytes.forEach((b) => binary += String.fromCharCode(b));
      return btoa(binary);
    }

    const p256dh = subscription.getKey('p256dh');
    const auth = subscription.getKey('auth');

    if (!p256dh || !auth) {
      console.error('Subscription keys tidak ada atau kosong, abort subscribe ke server');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('User belum login, tidak bisa subscribe push');
      return;
    }

    const cleanSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: arrayBufferToBase64(p256dh),
        auth: arrayBufferToBase64(auth),
      },
    };

    console.log('Payload subscription yang dikirim:', cleanSubscription);

    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cleanSubscription),
    });

    const result = await response.json();
    console.log('Response from server:', result);

    if (result.error) {
      console.error('Gagal subscribe push:', result.message);
    } else {
      console.log('Berhasil subscribe push notification:', result.message);
    }
  } catch (error) {
    console.error('Error subscribe push:', error);
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(async (registration) => {
        console.log('Service Worker terdaftar dengan scope:', registration.scope);
        if (registration.active) {
          await subscribeUserToPush(registration);
        } else {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                subscribeUserToPush(registration);
              }
            });
          });
        }
      })
      .catch(err => {
        console.error('Registrasi Service Worker gagal:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();
  const skipLink = document.querySelector('.skip-to-content');
  const mainContent = document.querySelector('#main-content');

  skipLink.addEventListener('click', function (event) {
    event.preventDefault(); 
    skipLink.blur(); 

    location.hash = '/home'; 
    mainContent.focus(); 
    mainContent.scrollIntoView(); 
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    Camera.stopAllStreams(); 
  });
});
