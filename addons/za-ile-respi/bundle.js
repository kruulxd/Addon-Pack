// Za ile respi Bundle - Wrapper
(function() {
    'use strict';
    
    console.log('[Addon Pack] Ładuję Za ile respi...');
    
    // Fetch i load oryginalny skrypt
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/kruulxd/iledoe2/refs/heads/main/za-ile-respi-addon.user.js?v=' + Date.now(),
        onload: function(response) {
            if (response.status === 200) {
                try {
                    // Usunąć UserScript header
                    const code = response.responseText
                        .replace(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/m, '');
                    eval(code);
                    console.log('[Addon Pack] ✓ Za ile respi załadowana');
                } catch (e) {
                    console.error('[Addon Pack] Błąd Za ile respi:', e);
                }
            } else {
                console.error('[Addon Pack] Błąd HTTP ' + response.status + ' dla Za ile respi');
            }
        },
        onerror: function(error) {
            console.error('[Addon Pack] Błąd ładowania Za ile respi:', error);
        }
    });
    
})();
