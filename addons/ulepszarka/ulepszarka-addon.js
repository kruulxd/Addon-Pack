// Ulepszarka Addon Wrapper

(function() {
    'use strict';
    
    // Expozycja GM API
    window.ulepszarka = {
        GM_getValue: (key, defaultValue) => {
            const stored = localStorage.getItem(`ulepszarka_${key}`);
            return stored ? JSON.parse(stored) : defaultValue;
        },
        GM_setValue: (key, value) => {
            localStorage.setItem(`ulepszarka_${key}`, JSON.stringify(value));
        },
        GM_deleteValue: (key) => {
            localStorage.removeItem(`ulepszarka_${key}`);
        },
        GM_listValues: () => {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('ulepszarka_')) {
                    keys.push(key.replace('ulepszarka_', ''));
                }
            }
            return keys;
        }
    };
    
    async function loadUlepszarkaBundle() {
        try {
            const bundleUrl = 'https://raw.githubusercontent.com/kruulxd/Ulepszarka/main/ulepszarka-bundle.js?v=' + Date.now();
            const response = await fetch(bundleUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const code = await response.text();
            const script = document.createElement('script');
            script.textContent = code;
            script.id = 'ulepszarka-bundle';
            document.body.appendChild(script);
        } catch (error) {
            console.error('✗ Ulepszarka:', error);
        }
    }
    
    // Ładuj zaraz
    loadUlepszarkaBundle();
})();
