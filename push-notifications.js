// Push Notifications Manager
const VAPID_PUBLIC_KEY = 'BNco5Q5-ZMF8-SBYJZYB5uboFsLrMqBr83QGdXe7xvjAlLPT0zY4rfcOfLkzEUqIg7qChBHzhoKXe4wiNtDWLt4';

let pushSubscription = null;

// Initialize push notifications
async function initPushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications not supported');
        return false;
    }
    
    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        await navigator.serviceWorker.ready;
        console.log('Service Worker is ready');
        
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
        
        if (permission === 'granted') {
            await subscribeToPush(registration);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Push notification init error:', error);
        return false;
    }
}

// Subscribe to push notifications
async function subscribeToPush(registration) {
    try {
        if (!registration.active) {
            console.log('Waiting for service worker to activate...');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        
        pushSubscription = subscription;
        console.log('Push subscription:', subscription);
        
        // Save subscription to localStorage
        localStorage.setItem('push_subscription', JSON.stringify(subscription));
        
        // Save to Firebase (skip if functions not available)
        if (typeof firebase !== 'undefined' && firebase.auth().currentUser && firebase.functions) {
            try {
                const userId = firebase.auth().currentUser.uid;
                const savePushSubscription = firebase.functions().httpsCallable('savePushSubscription');
                await savePushSubscription({ subscription, userId });
                console.log('Subscription saved to Firebase');
            } catch (err) {
                console.log('Firebase functions not available, subscription saved locally only');
            }
        }
        
        return subscription;
    } catch (error) {
        console.error('Push subscription error:', error);
        return null;
    }
}

// Send push notification (client-side simulation)
async function sendPushNotification(data) {
    if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || 'logo.jpeg',
            badge: 'logo.jpeg',
            vibrate: [200, 100, 200, 100, 200],
            tag: data.tag || 'medicore-notification',
            requireInteraction: data.requireInteraction || data.severity === 'Major',
            silent: false,
            data: data
        });
    }
}

// Utility function
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Check if notifications are enabled
function areNotificationsEnabled() {
    return Notification.permission === 'granted' && pushSubscription !== null;
}

// Request notification permission
async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await subscribeToPush(registration);
        return true;
    }
    return false;
}

// Export functions
window.initPushNotifications = initPushNotifications;
window.sendPushNotification = sendPushNotification;
window.areNotificationsEnabled = areNotificationsEnabled;
window.requestNotificationPermission = requestNotificationPermission;
