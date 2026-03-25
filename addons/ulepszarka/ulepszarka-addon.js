// Ulepszarka Addon Wrapper
// Ten adapter ładuje pełny kod z zewnętrznego bundla GitHub
// Zapewnia integrację z panelem Addon Pack

(function() {
    'use strict';
    
    console.log('🔧 Ładowanie Ulepszarki...');
    
    // Expozycja GM API dla Ulepszarki
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
    
    // Ładowanie bundla Ulepszarki
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
            
            console.log('✓ Ulepszarka bundle załadowany');
        } catch (error) {
            console.error('✗ Błąd ładowania bundla Ulepszarki:', error);
        }
    }
    
    // Oczekiwanie na Engine
    function waitForEngine() {
        if (window.Engine?.allInit && typeof window._g === 'function') {
            loadUlepszarkaBundle();
        } else {
            setTimeout(waitForEngine, 100);
        }
    }
    
    waitForEngine();
})();
