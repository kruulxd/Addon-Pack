// Za ile respi Addon Wrapper
// Ładuje pełny kod zusera Iledoe2 z zewnętrznego repo

(function() {
    'use strict';
    
    console.log('⏱️ Ładowanie Za ile respi...');
    
    // Ładowanie kodu Iledoe2
    async function loadIledoe2Code() {
        try {
            const codeUrl = 'https://raw.githubusercontent.com/kruulxd/iledoe2/main/za-ile-respi-addon.js?v=' + Date.now();
            const response = await fetch(codeUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const code = await response.text();
            const script = document.createElement('script');
            script.textContent = code;
            script.id = 'iledoe2-code';
            document.body.appendChild(script);
            
            console.log('✓ Za ile respi załadowany');
        } catch (error) {
            console.error('✗ Błąd ładowania Za ile respi:', error);
        }
    }
    
    // Oczekiwanie na Engine
    function waitForEngine() {
        if (window.Engine?.allInit && typeof window._g === 'function') {
            loadIledoe2Code();
        } else {
            setTimeout(waitForEngine, 100);
        }
    }
    
    waitForEngine();
})();
