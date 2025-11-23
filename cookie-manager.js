// Cookie Manager for Offline Data Persistence
// Saves page data as cookies for internet connection resilience

const CookieManager = {
    // Set cookie with expiration (default 7 days)
    set(name, value, days = 7) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
    },

    // Get cookie value
    get(name) {
        const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return value ? JSON.parse(decodeURIComponent(value.pop())) : null;
    },

    // Delete cookie
    delete(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Auto-save page data to cookies
function savePageData(page, data) {
    CookieManager.set(`page_${page}`, data);
    CookieManager.set('last_page', page);
}

// Load page data from cookies
function loadPageData(page) {
    return CookieManager.get(`page_${page}`);
}

// Save patients data
window.savePatientsCache = function(patients) {
    savePageData('patients', { results: patients, timestamp: Date.now() });
};

// Save appointments data
window.saveAppointmentsCache = function(appointments) {
    savePageData('appointments', { results: appointments, timestamp: Date.now() });
};

// Save encounters data
window.saveEncountersCache = function(encounters) {
    savePageData('encounters', { results: encounters, timestamp: Date.now() });
};

// Save dashboard stats
window.saveDashboardCache = function(stats) {
    savePageData('dashboard', { stats, timestamp: Date.now() });
};

// Save patient detail
window.savePatientDetailCache = function(patientId, data) {
    savePageData(`patient_${patientId}`, { ...data, timestamp: Date.now() });
};

// Load cached data with fallback
window.loadCachedData = function(page) {
    const cached = loadPageData(page);
    if (cached && Date.now() - cached.timestamp < 86400000) { // 24 hours
        return cached;
    }
    return null;
};

// Restore last page on load
window.restoreLastPage = function() {
    const lastPage = CookieManager.get('last_page');
    return lastPage || 'home';
};

console.log('✅ Cookie Manager loaded');
