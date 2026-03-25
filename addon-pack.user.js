// ==UserScript==
// @name         Addon Pack by Kruul
// @version      1.0.0
// @description  Panel dodatków Margonem
// @author       Kruul
// @match        https://*.margonem.pl/*
// @connect      raw.githubusercontent.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const REPO_BASE = 'https://raw.githubusercontent.com/kruulxd/Addon-Pack/refs/heads/main';
    
    // Wrapper do ładowania bundli z obejściem CSP
    window.addonPackLoadSubBundle = function(addon) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${REPO_BASE}/addons/${addon.id}/bundle.js?v=${Date.now()}`,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        eval(response.responseText);
                    } catch (e) {
                        console.error(`[Addon Pack] Błąd wykonania ${addon.id}:`, e);
                    }
                } else {
                    console.error(`[Addon Pack] Błąd HTTP ${response.status} dla ${addon.name}`);
                }
            },
            onerror: function(error) {
                console.error(`[Addon Pack] Błąd ładowania: ${addon.name}`);
            }
        });
    };
    
    function loadBundle() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${REPO_BASE}/addon-pack-bundle.js?v=${Date.now()}`,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        eval(response.responseText);
                    } catch (e) {
                        console.error('[Addon Pack] Błąd wykonania bundle:', e);
                    }
                } else {
                    console.error('[Addon Pack] Błąd HTTP ' + response.status);
                }
            },
            onerror: function(error) {
                console.error('[Addon Pack] Błąd ładowania bundle:', error);
            }
        });
    }

    // Ładuj bundle od razu
    loadBundle();
})();
