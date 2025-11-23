# 🗺️ Google Maps API Setup - Step by Step

## 📋 What You Need
- Google account
- 5 minutes
- Credit card (for verification only - won't be charged on free tier)

## 🚀 Step-by-Step Instructions

### Step 1: Go to Google Cloud Console
```
URL: https://console.cloud.google.com/
```
1. Sign in with your Google account
2. Accept terms of service if prompted

### Step 2: Create a New Project
1. Click the project dropdown (top-left, next to "Google Cloud")
2. Click "NEW PROJECT"
3. Enter project name: `MediCore-Emergency`
4. Click "CREATE"
5. Wait for project creation (10-15 seconds)
6. Select your new project from the dropdown

### Step 3: Enable Billing (Required)
1. Click "☰" menu → "Billing"
2. Click "LINK A BILLING ACCOUNT"
3. Click "CREATE BILLING ACCOUNT"
4. Enter credit card details (for verification)
5. Complete billing setup

**Note**: You won't be charged! Free tier includes:
- 28,000 map loads per month
- $200 free credit per month
- No automatic charges

### Step 4: Enable Maps JavaScript API
1. Click "☰" menu → "APIs & Services" → "Library"
2. Search for "Maps JavaScript API"
3. Click on "Maps JavaScript API"
4. Click "ENABLE"
5. Wait for activation (5-10 seconds)

### Step 5: Enable Geocoding API (Optional but Recommended)
1. Still in API Library
2. Search for "Geocoding API"
3. Click on "Geocoding API"
4. Click "ENABLE"

### Step 6: Create API Key
1. Click "☰" menu → "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" (top)
3. Select "API key"
4. Copy the API key that appears
5. Click "RESTRICT KEY" (recommended)

### Step 7: Restrict API Key (Recommended)
1. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Click "ADD AN ITEM"
   - Enter: `http://localhost:*/*` (for testing)
   - Enter: `https://yourdomain.com/*` (for production)
   - Click "DONE"

2. Under "API restrictions":
   - Select "Restrict key"
   - Check "Maps JavaScript API"
   - Check "Geocoding API" (if enabled)
   - Click "SAVE"

### Step 8: Configure Your Application
1. Open your project folder
2. Find file: `maps-config.js`
3. Replace the API key:

```javascript
// Before:
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// After:
const GOOGLE_MAPS_API_KEY = 'AIzaSyD...your-actual-key...xyz';
```

4. Save the file

### Step 9: Test the Integration
1. Open your application
2. Login with a patient account
3. Click the red 🆘 button (bottom-left)
4. Confirm the emergency alert
5. Allow location access
6. **Map should load** with your location marker

If map loads → ✅ Success!
If map doesn't load → See troubleshooting below

## 🔍 Troubleshooting

### Map Shows "For development purposes only"
**Cause**: Billing not enabled
**Solution**: Complete Step 3 (Enable Billing)

### Map Doesn't Load at All
**Cause**: API key not configured or invalid
**Solution**: 
1. Check `maps-config.js` has correct key
2. Verify key in Google Cloud Console
3. Check browser console for errors

### "This API project is not authorized to use this API"
**Cause**: Maps JavaScript API not enabled
**Solution**: Complete Step 4 (Enable API)

### "RefererNotAllowedMapError"
**Cause**: Domain not in allowed referrers
**Solution**: 
1. Go to Credentials in Google Cloud Console
2. Edit your API key
3. Add your domain to HTTP referrers
4. Save changes

### Location Permission Denied
**Cause**: Browser blocking location
**Solution**:
1. Click lock icon in address bar
2. Allow location access
3. Refresh page

## 💰 Cost Monitoring

### Free Tier Limits:
- **Map Loads**: 28,000 per month (FREE)
- **Geocoding**: 40,000 requests per month (FREE)
- **Monthly Credit**: $200 (FREE)

### How to Monitor Usage:
1. Go to Google Cloud Console
2. Click "☰" → "Billing" → "Reports"
3. View usage by API
4. Set up budget alerts (recommended)

### Setting Budget Alerts:
1. Go to "Billing" → "Budgets & alerts"
2. Click "CREATE BUDGET"
3. Set budget: $10 (or any amount)
4. Set alert at 50%, 90%, 100%
5. Enter your email
6. Click "FINISH"

## 🔐 Security Best Practices

### 1. Restrict API Key
✅ Always restrict to specific domains
✅ Only enable required APIs
✅ Regenerate key if exposed

### 2. Monitor Usage
✅ Check usage weekly
✅ Set up budget alerts
✅ Review API logs

### 3. Protect Your Key
❌ Don't commit to public GitHub
❌ Don't share in screenshots
❌ Don't hardcode in client-side code (use environment variables in production)

## 📊 Expected Usage

### For 100 Emergencies/Month:
- Map loads: ~200 (well within free tier)
- Geocoding: ~100 (well within free tier)
- Cost: $0 (FREE)

### For 1000 Emergencies/Month:
- Map loads: ~2,000 (well within free tier)
- Geocoding: ~1,000 (well within free tier)
- Cost: $0 (FREE)

## ✅ Verification Checklist

After setup, verify:
- [ ] API key copied to `maps-config.js`
- [ ] File saved
- [ ] Application restarted/refreshed
- [ ] SOS button visible
- [ ] Emergency alert works
- [ ] Location permission granted
- [ ] Map loads with marker
- [ ] No errors in browser console

## 🎯 Quick Test

```javascript
// Open browser console and run:
console.log(window.GOOGLE_MAPS_API_KEY);

// Should output your API key (not 'YOUR_API_KEY')
```

## 📞 Need Help?

### Google Cloud Support:
- Documentation: https://developers.google.com/maps/documentation
- Support: https://cloud.google.com/support
- Community: https://stackoverflow.com/questions/tagged/google-maps

### Common Questions:

**Q: Will I be charged?**
A: No, unless you exceed free tier limits (very unlikely)

**Q: Do I need a credit card?**
A: Yes, for verification, but won't be charged on free tier

**Q: Can I use the same key for multiple projects?**
A: Yes, but better to create separate keys for security

**Q: How do I delete my API key?**
A: Go to Credentials → Click key → DELETE

**Q: Can I change my API key later?**
A: Yes, just update `maps-config.js` with new key

## 🎉 Success!

Once your map loads, you have successfully:
- ✅ Created Google Cloud project
- ✅ Enabled billing (free tier)
- ✅ Enabled Maps JavaScript API
- ✅ Created and restricted API key
- ✅ Configured your application
- ✅ Tested the integration

**Your SOS Emergency System is now fully operational!** 🚑

---

**Next Steps:**
1. Test complete emergency workflow
2. Train staff on system usage
3. Set up monitoring and alerts
4. Review `SOS-SETUP.md` for advanced configuration

**Estimated Setup Time:** 5-10 minutes
**Difficulty:** Easy
**Cost:** $0 (Free tier)
