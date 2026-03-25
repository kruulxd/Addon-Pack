// ==UserScript==
// @name         Addon Pack by Kruul
// @version      1.0.0
// @description  Panel dodatków Margonem
// @author       Kruul
// @match        https://*.margonem.pl/*
// @connect      raw.githubusercontent.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const REPO_BASE = 'https://raw.githubusercontent.com/kruulxd/Addon-Pack/main';
    const ADDONS = [
        { id: 'ulepszarka', name: 'Ulepszarka', file: 'ulepszarka-addon.js' },
        { id: 'iledoe2', name: 'Za ile respi', file: 'iledoe2-addon.js' }
    ];
    
    let loaded = { ulepszarka: false, iledoe2: false };

    function loadAddon(addon) {
        const url = `${REPO_BASE}/addons/${addon.id}/${addon.file}?v=${Date.now()}`;
        
        fetch(url)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.text();
            })
            .then(code => {
                const script = document.createElement('script');
                script.textContent = code;
                script.id = `addon-${addon.id}`;
                document.body.appendChild(script);
                loaded[addon.id] = true;
            })
            .catch(e => console.error(`[Addon Pack] ✗ ${addon.name}:`, e.message));
    }

    // Auto-load addony jeśli były włączone
    const savedSettings = JSON.parse(localStorage.getItem('addonPackSettings') || '{}');
    
    function init() {
        ADDONS.forEach(addon => {
            if (savedSettings[addon.id]?.enabled) {
                loadAddon(addon);
            }
        });
        
        // Expose API dla panelu
        window.addonPack = {
            loadAddon: loadAddon,
            getLoaded: () => loaded,
            ADDONS: ADDONS
        };
    }

    // Czekaj na Engine
    if (window.Engine?.allInit && typeof window._g === 'function') {
        init();
    } else {
        setTimeout(() => init(), 500);
    }
})();
