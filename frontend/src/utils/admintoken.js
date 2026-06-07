export function getRole() {
    const t = localStorage.getItem('accessToken');
    if (!t) return null;
    try {
        const p = JSON.parse(atob(t.split('.')[1]));
        return p.role ?? p.auth ?? p.authorities ?? null;
    } catch {
        return null;
    }
}