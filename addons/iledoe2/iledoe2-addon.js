// Za ile respi Addon Wrapper

(function() {
    'use strict';
    
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
        } catch (error) {
            console.error('✗ Za ile respi:', error);
        }
    }
    
    // Ładuj zaraz
    loadIledoe2Code();
})();
