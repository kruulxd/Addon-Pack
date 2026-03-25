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
    
<<<<<<< HEAD
    let loaded = {};
    let settings = JSON.parse(localStorage.getItem('addonPackSettings') || '{}');

    function loadAddon(addon) {
        if (loaded[addon.id]) return;
        
=======
    let loaded = { ulepszarka: false, iledoe2: false };

    function loadAddon(addon) {
>>>>>>> 6ffc7a52b56982f1b86c495c3254a6a3ab4cb1a2
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
<<<<<<< HEAD
            .catch(e => console.error(`✗ ${addon.name}:`, e.message));
    }

    function unloadAddon(addon) {
        const script = document.getElementById(`addon-${addon.id}`);
        if (script) script.remove();
        loaded[addon.id] = false;
    }

    function toggleAddon(addonId, enable) {
        const addon = ADDONS.find(a => a.id === addonId);
        if (!addon) return;
        
        if (enable) {
            loadAddon(addon);
        } else {
            unloadAddon(addon);
        }
        
        settings[addonId] = { enabled: enable };
        localStorage.setItem('addonPackSettings', JSON.stringify(settings));
        updatePanelUI();
    }

    function createButton() {
        const btn = document.createElement('div');
        btn.id = 'addon-pack-btn';
        btn.innerHTML = '📦';
        btn.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 15px;
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            z-index: 99990;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid rgba(255,255,255,0.3);
            transition: all 0.3s;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        
        btn.addEventListener('click', togglePanel);
        document.body.appendChild(btn);
    }

    function togglePanel() {
        const panel = document.getElementById('addon-pack-panel');
        if (panel) {
            panel.remove();
            return;
        }
        createPanel();
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'addon-pack-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 15px;
            width: 300px;
            background: rgba(15,15,25,0.98);
            border: 2px solid rgba(102,126,234,0.4);
            border-radius: 12px;
            color: #fff;
            z-index: 99991;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            overflow: hidden;
            backdrop-filter: blur(10px);
        `;
        
        let html = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-bottom: 1px solid rgba(102,126,234,0.3);">
                <h2 style="margin: 0; font-size: 16px;">📦 Addon Pack</h2>
                <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(255,255,255,0.7);">v1.0.0</p>
            </div>
            <div style="padding: 10px; max-height: 400px; overflow-y: auto;">
        `;
        
        ADDONS.forEach(addon => {
            const enabled = settings[addon.id]?.enabled || false;
            const color = enabled ? '#4ade80' : '#ef4444';
            
            html += `
                <div style="background: rgba(50,50,70,0.4); border: 1px solid rgba(102,126,234,0.2); border-radius: 8px; padding: 10px; margin-bottom: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h3 style="margin: 0; font-size: 13px; color: #667eea;">${addon.name}</h3>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="font-size: 11px; color: ${color};">● ${enabled ? 'Włączony' : 'Wyłączony'}</span>
                        <button class="addon-btn" data-id="${addon.id}" style="
                            padding: 6px 12px;
                            background: ${enabled ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'};
                            border: 1px solid ${enabled ? '#4ade80' : '#ef4444'};
                            color: ${enabled ? '#4ade80' : '#ef4444'};
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 11px;
                            font-weight: bold;
                        ">${enabled ? 'Wyłącz' : 'Włącz'}</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        panel.innerHTML = html;
        document.body.appendChild(panel);
        
        panel.querySelectorAll('.addon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const enabled = settings[id]?.enabled || false;
                toggleAddon(id, !enabled);
            });
        });
        
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && e.target.id !== 'addon-pack-btn') {
                    panel.remove();
                }
            });
        }, 100);
    }

    function updatePanelUI() {
        const panel = document.getElementById('addon-pack-panel');
        if (panel) {
            panel.remove();
            createPanel();
        }
    }

    function init() {
        createButton();
        
        // Auto-load poprzednio włączone addony
        ADDONS.forEach(addon => {
            if (settings[addon.id]?.enabled) {
                loadAddon(addon);
            }
        });
    }

=======
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

>>>>>>> 6ffc7a52b56982f1b86c495c3254a6a3ab4cb1a2
    // Czekaj na Engine
    if (window.Engine?.allInit && typeof window._g === 'function') {
        init();
    } else {
        setTimeout(() => init(), 500);
    }
})();
