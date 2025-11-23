// Firebase Auth State Management
let currentUser = null;

// Wait for Firebase to be ready
if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
} else {
    // Use SOS Firebase for authentication
    const sosAuth = firebase.app('sos-emergency').auth();
    sosAuth.onAuthStateChanged(async (user) => {
        currentUser = user;
        if (user) {
            console.log('User logged in:', user.email);
            // Fetch role from Firebase if not in localStorage
            if (!localStorage.getItem('user_role')) {
                try {
                    const snapshot = await firebase.app('sos-emergency').database().ref(`users/${user.uid}`).once('value');
                    const userData = snapshot.val();
                    if (userData?.role) {
                        localStorage.setItem('user_role', userData.role);
                        console.log('Role restored from Firebase:', userData.role);
                    }
                } catch (error) {
                    console.error('Failed to fetch user role:', error);
                }
            }
        } else {
            console.log('User logged out');
        }
        updateAuthUI();
    });
}

// Update UI based on auth state
function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    const userRole = localStorage.getItem('user_role');
    
    console.log('🔄 updateAuthUI called');
    console.log('👤 currentUser:', currentUser?.email);
    console.log('🎭 userRole:', userRole);
    console.log('📍 authBtn element:', authBtn);
    console.log('📱 mobileAuthBtn element:', mobileAuthBtn);
    
    const desktopHTML = currentUser ? `
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">
                    ${currentUser.email.charAt(0).toUpperCase()}
                </div>
                <span style="color: white; font-size: 0.75rem; flex: 1; overflow: hidden; text-overflow: ellipsis;">${currentUser.email.split('@')[0]}</span>
            </div>
            <button onclick="logout()" class="btn" style="width: 100%; padding: 0.5rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; font-size: 0.875rem;">Logout</button>
        </div>
    ` : `
        <button onclick="showAuthModal('login')" class="btn btn-primary" style="width: 100%; padding: 0.625rem; font-size: 0.875rem;">Login</button>
        <button onclick="showAuthModal('signup')" class="btn btn-secondary" style="width: 100%; padding: 0.625rem; font-size: 0.875rem; margin-top: 0.5rem;">Sign Up</button>
    `;
    
    const mobileHTML = currentUser ? `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #0ea5e9, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">
                ${currentUser.email.charAt(0).toUpperCase()}
            </div>
            <button onclick="logout()" class="btn" style="padding: 0.5rem 1rem; background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444; font-size: 0.875rem;">Logout</button>
        </div>
    ` : `
        <div style="display: flex; gap: 0.5rem;">
            <button onclick="showAuthModal('login')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Login</button>
            <button onclick="showAuthModal('signup')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Sign Up</button>
        </div>
    `;
    
    if (authBtn) authBtn.innerHTML = desktopHTML;
    if (mobileAuthBtn) mobileAuthBtn.innerHTML = mobileHTML;
}

// Show Auth Modal
window.showAuthModal = function(type) {
    const modalRoot = document.getElementById('modal-root');
    const isLogin = type === 'login';
    
    const closeIcon = typeof icons !== 'undefined' ? icons.close : '✕';
    
    modalRoot.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal" onclick="event.stopPropagation()" style="max-width: 450px;">
                <div class="modal-header">
                    <h2>${isLogin ? 'Login' : 'Create Account'}</h2>
                    <button class="close-btn" onclick="closeModal()">${closeIcon}</button>
                </div>
                <form onsubmit="${isLogin ? 'handleLogin' : 'handleSignup'}(event)" style="padding: 1.5rem;">
                    <div class="form-group">
                        <label class="form-label">I am a</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 2px solid rgba(14, 165, 233, 0.3); border-radius: 8px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='#0ea5e9'" onmouseout="if(!this.querySelector('input').checked) this.style.borderColor='rgba(14, 165, 233, 0.3)'">
                                <input type="radio" name="role" value="doctor" required onchange="this.parentElement.parentElement.querySelectorAll('label').forEach(l => l.style.borderColor='rgba(14, 165, 233, 0.3)'); this.parentElement.style.borderColor='#0ea5e9';" style="width: 18px; height: 18px;">
                                <i class="fas fa-user-md" style="color: #0ea5e9;"></i>
                                <span style="color: #fff; font-weight: 500;">Doctor</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 2px solid rgba(14, 165, 233, 0.3); border-radius: 8px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderColor='#0ea5e9'" onmouseout="if(!this.querySelector('input').checked) this.style.borderColor='rgba(14, 165, 233, 0.3)'">
                                <input type="radio" name="role" value="patient" required onchange="this.parentElement.parentElement.querySelectorAll('label').forEach(l => l.style.borderColor='rgba(14, 165, 233, 0.3)'); this.parentElement.style.borderColor='#0ea5e9';" style="width: 18px; height: 18px;">
                                <i class="fas fa-user" style="color: #0ea5e9;"></i>
                                <span style="color: #fff; font-weight: 500;">Patient</span>
                            </label>
                        </div>
                    </div>
                    ${!isLogin ? `
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" name="name" required placeholder="John Doe">
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label class="form-label">Email Address</label>
                        <input type="email" class="form-input" name="email" required placeholder="you@example.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-input" name="password" required placeholder="••••••••" minlength="6">
                    </div>
                    ${!isLogin ? `
                        <div class="form-group">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" class="form-input" name="confirmPassword" required placeholder="••••••••" minlength="6">
                        </div>
                    ` : ''}
                    <div class="form-group" style="margin-top: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" id="enable-notifications" style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="color: #94a3b8; font-size: 0.875rem;">Enable push notifications for alerts and reminders</span>
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                        ${isLogin ? 'Login' : 'Create Account'}
                    </button>
                    
                    <div style="display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0;">
                        <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
                        <span style="color: #94a3b8; font-size: 0.875rem;">OR</span>
                        <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.1);"></div>
                    </div>
                    
                    <button type="button" onclick="loginWithGoogle()" class="btn" style="width: 100%; background: white; color: #1f2937; display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
                        Continue with Google
                    </button>
                    
                    <div style="text-align: center; margin-top: 1rem; color: #94a3b8; font-size: 0.875rem;">
                        ${isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <a href="javascript:void(0)" onclick="showAuthModal('${isLogin ? 'signup' : 'login'}')" style="color: #0ea5e9; font-weight: 600; margin-left: 0.25rem;">
                            ${isLogin ? 'Sign Up' : 'Login'}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Handle Login
window.handleLogin = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const enableNotifications = document.getElementById('enable-notifications')?.checked;
    
    try {
        Swal.fire({ title: 'Logging in...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const sosAuth = firebase.app('sos-emergency').auth();
        await sosAuth.signInWithEmailAndPassword(email, password);
        
        localStorage.setItem('user_role', role);
        
        if (enableNotifications && typeof window.requestNotificationPermission === 'function') {
            await window.requestNotificationPermission();
        }
        
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: `Logged in as ${role}`,
            timer: 2000,
            showConfirmButton: false
        });
        
        navigate(role === 'doctor' ? 'dashboard' : 'home');
        setTimeout(() => sendLoginNotification(email), 1000);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.message
        });
    }
}

// Handle Signup
window.handleSignup = async function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const role = formData.get('role');
    const enableNotifications = document.getElementById('enable-notifications')?.checked;
    
    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Password Mismatch',
            text: 'Passwords do not match'
        });
        return;
    }
    
    try {
        Swal.fire({ title: 'Creating account...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const sosAuth = firebase.app('sos-emergency').auth();
        const userCredential = await sosAuth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        localStorage.setItem('user_role', role);
        await firebase.app('sos-emergency').database().ref(`users/${userCredential.user.uid}`).set({
            name, email, role, created: Date.now()
        });
        
        if (enableNotifications && typeof window.requestNotificationPermission === 'function') {
            await window.requestNotificationPermission();
        }
        
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: `Welcome to MediCore as ${role}`,
            timer: 2000,
            showConfirmButton: false
        });
        
        navigate(role === 'doctor' ? 'dashboard' : 'home');
        setTimeout(() => sendLoginNotification(email), 1000);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Signup Failed',
            text: error.message
        });
    }
}

// Logout
window.logout = async function() {
    try {
        const sosAuth = firebase.app('sos-emergency').auth();
        await sosAuth.signOut();
        localStorage.removeItem('user_role');
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been logged out successfully',
            timer: 2000,
            showConfirmButton: false
        });
        navigate('home');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: error.message
        });
    }
}

// Google Sign-In
window.loginWithGoogle = async function() {
    try {
        const sosAuth = firebase.app('sos-emergency').auth();
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await sosAuth.signInWithPopup(provider);
        
        localStorage.setItem('user_role', 'patient');
        await firebase.app('sos-emergency').database().ref(`users/${result.user.uid}`).set({
            name: result.user.displayName,
            email: result.user.email,
            role: 'patient',
            created: Date.now()
        });
        
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Successfully signed in with Google as patient',
            timer: 2000,
            showConfirmButton: false
        });
        navigate('home');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Google Sign-In Failed',
            text: error.message
        });
    }
}

// Check if user is authenticated
window.requireAuth = function() {
    if (!currentUser) {
        Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'Please login to access this feature',
            confirmButtonText: 'Login'
        }).then((result) => {
            if (result.isConfirmed) {
                showAuthModal('login');
            }
        });
        return false;
    }
    return true;
}

// Send login notification with patient stats
async function sendLoginNotification(email) {
    console.log('🔔 ===== LOGIN NOTIFICATION START =====');
    console.log('📧 User email:', email);
    
    // Check notification permission
    console.log('🔐 Checking notification permission:', Notification.permission);
    if (Notification.permission !== 'granted') {
        console.log('⚠️ Notifications not enabled. Requesting permission...');
        const permission = await Notification.requestPermission();
        console.log('🔐 Permission result:', permission);
        if (permission !== 'granted') {
            console.log('❌ User denied notification permission');
            console.log('🔔 ===== LOGIN NOTIFICATION END (NO PERMISSION) =====');
            return;
        }
    }
    
    try {
        console.log('📡 Fetching all patients from API...');
        const patients = await apiCall('/patients');
        console.log('✅ Patients fetched. Total count:', patients.results?.length || 0);
        
        console.log('🔍 Searching for patient with email:', email);
        const patient = patients.results?.find(p => p.email === email);
        
        if (!patient) {
            console.log('❌ No patient record found for email:', email);
            console.log('📋 Available patient emails:', patients.results?.map(p => p.email).filter(e => e).join(', ') || 'None');
            console.log('🔔 ===== LOGIN NOTIFICATION END (NO MATCH) =====');
            return;
        }
        
        console.log('✅ Patient found!');
        console.log('👤 Patient ID:', patient.id);
        console.log('👤 Patient Name:', patient.first_name, patient.last_name);
        console.log('📧 Patient Email:', patient.email);
        
        console.log('📡 Fetching appointments and encounters for patient ID:', patient.id);
        const [appointments, encounters] = await Promise.all([
            apiCall(`/patients/${patient.id}/appointments`).catch(err => {
                console.error('⚠️ Failed to fetch appointments:', err.message);
                return { results: [] };
            }),
            apiCall(`/patients/${patient.id}/encounters`).catch(err => {
                console.error('⚠️ Failed to fetch encounters:', err.message);
                return { results: [] };
            })
        ]);
        
        const appointmentCount = appointments.results?.length || 0;
        const encounterCount = encounters.results?.length || 0;
        
        console.log('📊 Appointment count:', appointmentCount);
        console.log('📊 Encounter count:', encounterCount);
        
        const notificationBody = `You have ${appointmentCount} appointment${appointmentCount !== 1 ? 's' : ''} and ${encounterCount} encounter${encounterCount !== 1 ? 's' : ''}`;
        console.log('📝 Notification message:', notificationBody);
        
        // Send push notification
        if (Notification.permission === 'granted' && typeof window.sendPushNotification === 'function') {
            console.log('🔔 Sending push notification...');
            await window.sendPushNotification({
                title: `Welcome back, ${patient.first_name}!`,
                body: notificationBody,
                icon: 'logo.jpeg',
                tag: 'login-notification'
            });
            console.log('✅ Push notification sent successfully!');
        }
        
        // Always show toast notification
        console.log('📢 Showing toast notification...');
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `Welcome back, ${patient.first_name}!`,
            html: `
                <div style="font-size: 0.9rem; color: #374151;">
                    <strong>${appointmentCount}</strong> appointment${appointmentCount !== 1 ? 's' : ''} • 
                    <strong>${encounterCount}</strong> encounter${encounterCount !== 1 ? 's' : ''}
                </div>
            `,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
        });
        console.log('✅ Toast notification shown!');
        
        console.log('🔔 ===== LOGIN NOTIFICATION END (SUCCESS) =====');
    } catch (error) {
        console.error('❌ ===== LOGIN NOTIFICATION ERROR =====');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('🔔 ===== LOGIN NOTIFICATION END (ERROR) =====');
    }
}
