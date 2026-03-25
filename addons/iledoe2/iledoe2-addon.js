// Za ile respi Addon Wrapper

(function() {
    'use strict';
    
    async function loadIledoe2Code() {
        try {
            // Spróbuj nową nazwę pliku
            const urls = [
                'https://raw.githubusercontent.com/kruulxd/iledoe2/main/za-ile-respi-addon.user.js',
                'https://raw.githubusercontent.com/kruulxd/iledoe2/main/za-ile-respi-addon.js'
            ];
            
            let code = null;
            for (const url of urls) {
                const response = await fetch(url + '?v=' + Date.now());
                if (response.ok) {
                    code = await response.text();
                    break;
                }
            }
            
            if (!code) throw new Error('File not found');
            
            const script = document.createElement('script');
            script.textContent = code;
            script.id = 'iledoe2-code';
            document.body.appendChild(script);
        } catch (error) {
            console.error('✗ Za ile respi:', error);
        }
    }
    
    loadIledoe2Code();
})();
