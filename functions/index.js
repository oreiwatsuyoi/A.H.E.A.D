const {onRequest, onCall} = require('firebase-functions/v2/https');
const {onSchedule} = require('firebase-functions/v2/scheduler');
const axios = require('axios');
const admin = require('firebase-admin');
const webpush = require('web-push');

admin.initializeApp();

const API_BASE = 'https://hackathon-api.aheadafrica.org/v1';
const AUTH_TOKEN = 'ND3T27IJ4D:whNhkiyAjxE0YQYvybTzfm_BvUXFzWK6VrE88nKgFVw';

// VAPID keys
const VAPID_PUBLIC_KEY = 'BNco5Q5-ZMF8-SBYJZYB5uboFsLrMqBr83QGdXe7xvjAlLPT0zY4rfcOfLkzEUqIg7qChBHzhoKXe4wiNtDWLt4';
const VAPID_PRIVATE_KEY = 'E2YlSuCb99XX01RG8bxpG3Llzf8WZTghlyB0riqCN58';

webpush.setVapidDetails(
  'mailto:support@medicore.health',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.api = onRequest({timeoutSeconds: 300}, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.status(200).send('');
        return;
    }
    
    try {
        const path = req.path.replace('/api', '');
        const url = `${API_BASE}${path}`;
        
        const response = await axios({
            method: req.method,
            url: url,
            params: req.query,
            data: req.body,
            headers: {
                'Authorization': `Token ${AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        });
        
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data
        });
    }
});

// Save push subscription
exports.savePushSubscription = onCall(async (request) => {
    const { subscription, userId } = request.data;
    
    await admin.firestore().collection('pushSubscriptions').doc(userId).set({
        subscription,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true };
});

// Send push notification
exports.sendPushNotification = onCall(async (request) => {
    const { userId, notification } = request.data;
    
    const doc = await admin.firestore().collection('pushSubscriptions').doc(userId).get();
    
    if (!doc.exists) {
        throw new Error('No subscription found');
    }
    
    const { subscription } = doc.data();
    
    const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/icon.png',
        severity: notification.severity,
        tag: notification.tag
    });
    
    await webpush.sendNotification(subscription, payload);
    return { success: true };
});

// Drug interaction webhook
exports.drugInteractionWebhook = onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).send('');
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(200).json({ success: true, message: 'Webhook endpoint ready' });
        return;
    }
    
    const { event, severity, details, resource, resource_id } = req.body;
    
    const subscriptions = await admin.firestore().collection('pushSubscriptions').get();
    
    const payload = JSON.stringify({
        title: `${severity} Drug Interaction Alert`,
        body: details,
        severity,
        tag: `drug-interaction-${resource_id}`
    });
    
    const promises = subscriptions.docs.map(doc => {
        const { subscription } = doc.data();
        return webpush.sendNotification(subscription, payload).catch(err => {
            console.error('Failed to send:', err);
        });
    });
    
    await Promise.all(promises);
    
    res.status(200).json({ success: true, sent: promises.length });
});

// Appointment reminder (runs every hour)
exports.appointmentReminder = onSchedule('every 1 hours', async (event) => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const appointments = await admin.firestore()
        .collection('appointments')
        .where('date', '>=', now)
        .where('date', '<=', oneHourLater)
        .where('reminderSent', '==', false)
        .get();
    
    const subscriptions = await admin.firestore().collection('pushSubscriptions').get();
    
    for (const appt of appointments.docs) {
        const data = appt.data();
        
        const payload = JSON.stringify({
            title: 'Appointment Reminder',
            body: `You have an appointment in 1 hour: ${data.reason}`,
            tag: `appointment-${appt.id}`
        });
        
        await Promise.all(subscriptions.docs.map(doc => {
            const { subscription } = doc.data();
            return webpush.sendNotification(subscription, payload).catch(err => {
                console.error('Failed to send reminder:', err);
            });
        }));
        
        await appt.ref.update({ reminderSent: true });
    }
});

