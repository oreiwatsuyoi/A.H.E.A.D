// Override showLobby to hide MediCore UI
const originalShowLobby = window.showLobby;
if (typeof originalShowLobby === 'function') {
    window.showLobby = function() {
        document.querySelector('.sidebar')?.style.setProperty('display', 'none', 'important');
        document.querySelector('.main-content')?.style.setProperty('display', 'none', 'important');
        originalShowLobby();
    };
}

// Override showCall to hide MediCore UI
const originalShowCall = window.showCall;
if (typeof originalShowCall === 'function') {
    window.showCall = function() {
        document.querySelector('.sidebar')?.style.setProperty('display', 'none', 'important');
        document.querySelector('.main-content')?.style.setProperty('display', 'none', 'important');
        originalShowCall();
    };
}

// Override showWelcome to show MediCore UI
const originalShowWelcome = window.showWelcome;
if (typeof originalShowWelcome === 'function') {
    window.showWelcome = function() {
        originalShowWelcome();
        document.querySelector('.sidebar')?.style.removeProperty('display');
        document.querySelector('.main-content')?.style.removeProperty('display');
    };
}

// Override endCall to show MediCore UI
const originalEndCall = window.endCall;
if (typeof originalEndCall === 'function') {
    window.endCall = function() {
        originalEndCall();
        setTimeout(() => {
            document.querySelector('.sidebar')?.style.removeProperty('display');
            document.querySelector('.main-content')?.style.removeProperty('display');
        }, 600);
    };
}

// Replace join button handler to skip compliance
setTimeout(() => {
    const joinBtn = document.getElementById('join-call-btn');
    if (joinBtn) {
        joinBtn.onclick = async function() {
            try {
                myId = database.ref().push().key;
                roomRef = database.ref('rooms/' + roomName);
                
                await roomRef.child('hostId').transaction((currentHostId) => {
                    if (currentHostId === null) {
                        isHost = true;
                        return myId;
                    }
                    return;
                });
                
                if (lobbyStream) {
                    lobbyStream.getTracks().forEach(track => track.stop());
                }
                
                await startCall();
                showCall();
            } catch (error) {
                console.error('Error joining call:', error);
            }
        };
    }
}, 2000);
