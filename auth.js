// Firebase Auth State Management
let currentUser = null;

// Wait for Firebase to be ready
if (typeof firebase === 'undefined') {
    console.error('Firebase not loaded');
} else {
    // Initialize Firebase Auth
    firebase.auth().onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI();
        if (user) {
            console.log('User logged in:', user.email);
        } else {
            console.log('User logged out');
        }
    });
}

// Update UI based on auth state
function updateAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    
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
    
    try {
        Swal.fire({ title: 'Logging in...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await firebase.auth().signInWithEmailAndPassword(email, password);
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: 'You have successfully logged in',
            timer: 2000,
            showConfirmButton: false
        });
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
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'Welcome to MediCore',
            timer: 2000,
            showConfirmButton: false
        });
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
        await firebase.auth().signOut();
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
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Welcome!',
            text: 'Successfully signed in with Google',
            timer: 2000,
            showConfirmButton: false
        });
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
