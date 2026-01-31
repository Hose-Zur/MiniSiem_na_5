/**
 * Wrapper na Fetch API do komunikacji z backendem Flask
 */

const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// --- HOSTS (GOTOWE - WZÓR) ---
export async function fetchHosts() {
    const res = await fetch('/api/hosts');
    return await res.json();
}
export async function createHost(data) {
    const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error((await res.json()).error);
    return await res.json();
}
export async function updateHost(id, data) {
    const res = await fetch(`/api/hosts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('Błąd edycji hosta');
    return await res.json();
}
export async function removeHost(id) {
    await fetch(`/api/hosts/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        }
    });
}

// --- MONITORING / LOGI (GOTOWE) ---
export async function checkHostStatus(id, osType) {
    const endpoint = (osType === 'LINUX') 
        ? `/api/hosts/${id}/ssh-info` 
        : `/api/hosts/${id}/windows-info`;
        
    const res = await fetch(endpoint);
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Błąd HTTP ${res.status}`);
    }
    return await res.json();
}

export async function triggerLogFetch(hostId) {
    const res = await fetch(`/api/hosts/${hostId}/logs`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        }
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Błąd pobierania logów');
    }
    return await res.json();
}

// --- THREAT INTEL API ---

export async function fetchIPs() {
    const res = await fetch('/api/ips');
    if (!res.ok) throw new Error('Błąd pobierania adresów IP');
    return await res.json();
}

export async function createIP(data) {
    const res = await fetch('/api/ips', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return await res.json();
}

export async function updateIP(id, data) {
    const res = await fetch(`/api/ips/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Błąd edycji adresu IP');
    return await res.json();
}

export async function removeIP(id) {
    const res = await fetch(`/api/ips/${id}`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': csrfToken
        }
    });
    if (!res.ok) throw new Error('Błąd usuwania adresu IP');
}

// --- DASHBOARD API ---

export async function fetchAlerts() {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Błąd pobierania alertów');
    return await res.json();
}