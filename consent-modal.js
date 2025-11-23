// Consent Modal for Cookies & Permissions
function showConsentModal() {
    const hasConsent = localStorage.getItem('user_consent');
    if (hasConsent) return;

    const modal = document.createElement('div');
    modal.id = 'consent-modal';
    modal.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(135deg, #1e293b, #0f172a); border-top: 3px solid #0ea5e9; padding: 1.5rem; z-index: 99999; box-shadow: 0 -10px 40px rgba(0,0,0,0.5);">
            <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: center;">
                <div>
                    <h3 style="color: #fff; font-size: 1.25rem; margin: 0 0 0.75rem 0; font-weight: 600;">🍪 Welcome to MediCore</h3>
                    <p style="color: #94a3b8; margin: 0 0 1rem 0; line-height: 1.6;">We use cookies to save your data for offline access and need permissions for full functionality:</p>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                        <div style="background: rgba(14, 165, 233, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #0ea5e9;">
                            <div style="color: #0ea5e9; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">🔔 Notifications</div>
                            <div style="color: #cbd5e1; font-size: 0.8rem;">Appointment & health alerts</div>
                        </div>
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #10b981;">
                            <div style="color: #10b981; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">🎥 Camera & Mic</div>
                            <div style="color: #cbd5e1; font-size: 0.8rem;">Video consultations</div>
                        </div>
                        <div style="background: rgba(139, 92, 246, 0.1); padding: 0.75rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">
                            <div style="color: #8b5cf6; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">📍 Location</div>
                            <div style="color: #cbd5e1; font-size: 0.8rem;">Emergency services</div>
                        </div>
                    </div>
                    <p style="color: #64748b; font-size: 0.85rem; margin: 0;">By accepting, you agree to cookies and grant permissions. You can change settings anytime.</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; min-width: 200px;">
                    <button onclick="acceptConsent()" style="background: linear-gradient(135deg, #0ea5e9, #0c4a6e); color: white; border: none; padding: 0.875rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: transform 0.2s;">Accept All</button>
                    <button onclick="rejectConsent()" style="background: rgba(255,255,255,0.1); color: #94a3b8; border: 1px solid rgba(255,255,255,0.2); padding: 0.875rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: transform 0.2s;">Reject</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.acceptConsent = async function() {
    localStorage.setItem('user_consent', 'accepted');
    localStorage.setItem('cookies_accepted', 'true');
    
    // Request permissions
    try {
        await Notification.requestPermission();
    } catch (e) {}
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    
    try {
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    localStorage.setItem('location_permission', 'granted');
                    resolve(pos);
                },
                (err) => {
                    localStorage.setItem('location_permission', 'denied');
                    reject(err);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    } catch (e) {
        console.error('Location permission error:', e);
    }
    
    document.getElementById('consent-modal').remove();
}

window.rejectConsent = function() {
    localStorage.setItem('user_consent', 'rejected');
    localStorage.setItem('cookies_accepted', 'false');
    document.getElementById('consent-modal').remove();
}

// Show modal after page load
setTimeout(showConsentModal, 1000);
