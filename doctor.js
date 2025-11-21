// Doctor Consultation with WebRTC Integration
let doctorStream = null;
let doctorCallTimer = null;
let doctorCallStartTime = null;
let doctorPeerConnections = {};
let doctorRoomRef = null;
let doctorMyId = null;
let doctorRoomName = null;

// Firebase config for doctor consultation
const doctorFirebaseConfig = {
  apiKey: "AIzaSyAK2n-ZUqMXgsIpyJ5m6iXjPX-kNlPqvwY",
  authDomain: "webrtc-a141d.firebaseapp.com",
  databaseURL: "https://webrtc-a141d-default-rtdb.firebaseio.com/",
  projectId: "webrtc-a141d",
  storageBucket: "webrtc-a141d.firebasestorage.app",
  messagingSenderId: "207832483278",
  appId: "1:207832483278:web:de9faaf17137d1380d579f"
};

// Initialize Firebase for doctor consultation
if (!firebase.apps.length) {
    firebase.initializeApp(doctorFirebaseConfig);
}
const doctorDatabase = firebase.database();

const doctorRTCConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

function handleDoctorAccess(event) {
    event.preventDefault();
    const code = document.getElementById('doctor-access-code').value.trim().toUpperCase();
    
    if (code.length === 6) {
        doctorRoomName = code;
        document.getElementById('doctor-welcome').style.display = 'none';
        document.getElementById('doctor-lobby').style.display = 'block';
        initializeDoctorLobby();
    } else {
        alert('Please enter a valid 6-digit access code');
    }
}

async function initializeDoctorLobby() {
    try {
        doctorStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
            audio: { echoCancellation: true, noiseSuppression: true }
        });
        document.getElementById('doctor-lobby-video').srcObject = doctorStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
    }
}

function toggleLobbyAudio() {
    if (doctorStream) {
        const audioTrack = doctorStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        const btn = document.getElementById('doctor-lobby-mute-audio');
        btn.innerHTML = audioTrack.enabled ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash"></i>';
        btn.style.background = audioTrack.enabled ? '' : '#ef4444';
    }
}

function toggleLobbyVideo() {
    if (doctorStream) {
        const videoTrack = doctorStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        const btn = document.getElementById('doctor-lobby-mute-video');
        btn.innerHTML = videoTrack.enabled ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
        btn.style.background = videoTrack.enabled ? '' : '#ef4444';
    }
}

async function joinDoctorCall() {
    try {
        doctorMyId = doctorDatabase.ref().push().key;
        doctorRoomRef = doctorDatabase.ref('doctor-rooms/' + doctorRoomName);
        
        document.getElementById('doctor-lobby').style.display = 'none';
        document.getElementById('doctor-call').style.display = 'block';
        
        if (doctorStream) {
            document.getElementById('doctor-local-video').srcObject = doctorStream;
        }
        
        await setupDoctorWebRTC();
        startDoctorCallTimer();
    } catch (error) {
        console.error('Error joining call:', error);
        alert('Unable to join call. Please try again.');
    }
}

async function setupDoctorWebRTC() {
    const usersRef = doctorRoomRef.child('users');
    
    usersRef.on('child_added', (snapshot) => {
        const otherUserId = snapshot.key;
        if (otherUserId === doctorMyId) return;
        
        const isInitiator = doctorMyId > otherUserId;
        if (isInitiator) {
            setTimeout(() => initiateDoctorPeerConnection(otherUserId, true), 1000);
        }
    });
    
    usersRef.on('child_removed', (snapshot) => {
        const otherUserId = snapshot.key;
        if (otherUserId === doctorMyId) return;
        closeDoctorPeerConnection(otherUserId);
    });
    
    await usersRef.child(doctorMyId).set({
        displayName: 'Patient',
        joinedAt: firebase.database.ServerValue.TIMESTAMP
    });
    
    const mySignalingRef = doctorRoomRef.child('signaling').child(doctorMyId);
    mySignalingRef.on('child_added', async (snapshot) => {
        const message = snapshot.val();
        if (!message || !message.from) return;
        
        const { from, sdp, candidate } = message;
        
        if (sdp && !doctorPeerConnections[from]) {
            initiateDoctorPeerConnection(from, false);
        }
        
        const pc = doctorPeerConnections[from];
        if (pc) {
            if (sdp) {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                if (sdp.type === 'offer') {
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    sendDoctorSignalingMessage(from, { sdp: answer });
                }
            } else if (candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        }
        
        setTimeout(() => snapshot.ref.remove(), 1000);
    });
}

async function initiateDoctorPeerConnection(otherUserId, isInitiator) {
    if (doctorPeerConnections[otherUserId]) return;
    
    const pc = new RTCPeerConnection(doctorRTCConfig);
    doctorPeerConnections[otherUserId] = pc;
    
    if (doctorStream) {
        doctorStream.getTracks().forEach(track => {
            pc.addTrack(track, doctorStream);
        });
    }
    
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendDoctorSignalingMessage(otherUserId, { candidate: event.candidate.toJSON() });
        }
    };
    
    pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
            const videoGrid = document.getElementById('doctor-video-grid');
            videoGrid.innerHTML = `
                <div style="position: relative; background: #1a1a1a; border-radius: 12px; overflow: hidden; width: 100%; height: 100%;">
                    <video id="doctor-remote-video" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                    <div style="position: absolute; top: 12px; left: 12px; background: var(--primary); color: white; padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Dr. Sarah Johnson</div>
                </div>
            `;
            document.getElementById('doctor-remote-video').srcObject = event.streams[0];
        }
    };
    
    if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendDoctorSignalingMessage(otherUserId, { sdp: offer });
    }
}

function sendDoctorSignalingMessage(to, message) {
    const targetRef = doctorRoomRef.child('signaling').child(to);
    const messageId = targetRef.push().key;
    targetRef.child(messageId).set({
        from: doctorMyId,
        timestamp: Date.now(),
        ...message
    });
}

function closeDoctorPeerConnection(otherUserId) {
    if (doctorPeerConnections[otherUserId]) {
        doctorPeerConnections[otherUserId].close();
        delete doctorPeerConnections[otherUserId];
    }
}

function startDoctorCallTimer() {
    doctorCallStartTime = Date.now();
    doctorCallTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - doctorCallStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        document.getElementById('doctor-call-timer').textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function toggleCallAudio() {
    if (doctorStream) {
        const audioTrack = doctorStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        const btn = document.getElementById('doctor-mute-audio');
        btn.innerHTML = audioTrack.enabled ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash"></i>';
        btn.style.background = audioTrack.enabled ? '' : '#ef4444';
    }
}

function toggleCallVideo() {
    if (doctorStream) {
        const videoTrack = doctorStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        const btn = document.getElementById('doctor-mute-video');
        btn.innerHTML = videoTrack.enabled ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
        btn.style.background = videoTrack.enabled ? '' : '#ef4444';
    }
}

function endDoctorCall() {
    if (confirm('Are you sure you want to end the consultation?')) {
        if (doctorCallTimer) {
            clearInterval(doctorCallTimer);
        }
        
        if (doctorStream) {
            doctorStream.getTracks().forEach(track => track.stop());
            doctorStream = null;
        }
        
        Object.values(doctorPeerConnections).forEach(pc => pc.close());
        doctorPeerConnections = {};
        
        if (doctorRoomRef && doctorMyId) {
            doctorRoomRef.child('users').child(doctorMyId).remove();
            doctorRoomRef.child('signaling').child(doctorMyId).remove();
            doctorRoomRef.off();
        }
        
        document.getElementById('doctor-call').style.display = 'none';
        document.getElementById('doctor-welcome').style.display = 'block';
        document.getElementById('doctor-access-code').value = '';
        
        alert('Consultation ended. Thank you!');
    }
}
