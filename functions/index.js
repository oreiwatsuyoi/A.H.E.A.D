const {onRequest} = require('firebase-functions/v2/https');
const axios = require('axios');

const API_BASE = 'https://hackathon-api.aheadafrica.org/v1';
const AUTH_TOKEN = 'ND3T27IJ4D:whNhkiyAjxE0YQYvybTzfm_BvUXFzWK6VrE88nKgFVw';

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
