// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
    console.log('Push notification received:', event);
    
    const data = event.data ? event.data.json() : {
        title: 'MediCore Notification',
        body: 'You have a new notification',
        icon: '/icon.png'
    };
    
    const options = {
        body: data.body || data.details,
        icon: data.icon || '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'medicore-notification',
        requireInteraction: data.severity === 'Major',
        data: data,
        actions: [
            { action: 'view', title: 'View Details' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'MediCore Alert', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
