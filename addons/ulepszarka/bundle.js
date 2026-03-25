// Ulepszarka Bundle - Wrapper
(function() {
    'use strict';
    
    console.log('[Addon Pack] Ładuję Ulepszarkę...');
    
    // Fetch i load oryginalny skrypt
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/kruulxd/Ulepszarka/refs/heads/main/ulepszarka-wild.user.js?v=' + Date.now(),
        onload: function(response) {
            if (response.status === 200) {
                try {
                    // Usunąć UserScript header
                    const code = response.responseText
                        .replace(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/m, '');
                    eval(code);
                    console.log('[Addon Pack] ✓ Ulepszarka załadowana');
                } catch (e) {
                    console.error('[Addon Pack] Błąd Ulepszarki:', e);
                }
            } else {
                console.error('[Addon Pack] Błąd HTTP ' + response.status + ' dla Ulepszarki');
            }
        },
        onerror: function(error) {
            console.error('[Addon Pack] Błąd ładowania Ulepszarki:', error);
        }
    });
    
})();
