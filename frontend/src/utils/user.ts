export interface UserProfile {
    username: string;
    displayName: string;
    title: string;
    department: string;
}

const USER_STORAGE_KEY = 'checkmate_current_user';

export const getCurrentUser = (): UserProfile => {
    try {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch {}
    return {
        username: 'Scaluya7',
        displayName: 'Prof. Susan Caluya',
        title: 'Prof. Caluya',
        department: 'Computer Science',
    };
};

export const setCurrentUser = (username: string): UserProfile => {
    const cleanUsername = username.trim() || 'Scaluya7';
    let displayName = cleanUsername;
    let title = cleanUsername;

    if (cleanUsername.toLowerCase().includes('caluya') || cleanUsername.toLowerCase() === 'scaluya7') {
        displayName = 'Prof. Susan Caluya';
        title = 'Prof. Caluya';
    } else if (cleanUsername.toLowerCase().startsWith('prof.')) {
        displayName = cleanUsername;
        title = cleanUsername;
    } else if (cleanUsername.toLowerCase().startsWith('prof')) {
        displayName = `Prof. ${cleanUsername.slice(4).trim()}`;
        title = displayName;
    } else {
        const formatted = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
        displayName = `Prof. ${formatted}`;
        title = `Prof. ${formatted}`;
    }

    const profile: UserProfile = {
        username: cleanUsername,
        displayName,
        title,
        department: 'Computer Science',
    };

    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch {}

    window.dispatchEvent(new CustomEvent('checkmate_user_updated', { detail: profile }));
    return profile;
};
