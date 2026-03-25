// ==UserScript==
// @name         Addon Pack by Kruul
// @version      1.0.0
// @description  Panel dodatków Margonem
// @author       Kruul
// @match        https://*.margonem.pl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BASE = 'https://raw.githubusercontent.com/kruulxd/Addon-Pack/main';
    const ADDONS = [
        { id: 'ulepszarka', name: 'Ulepszarka', url: '/addons/ulepszarka/ulepszarka-addon.js' },
        { id: 'iledoe2', name: 'Za ile respi', url: '/addons/iledoe2/iledoe2-addon.js' }
    ];

    // === BUTTON ===
    function createButton() {
        const btn = document.createElement('div');
        btn.id = 'addon-pack-btn';
        btn.innerHTML = '📦';
        btn.style.cssText = `position: fixed; bottom: 60px; right: 15px; width: 44px; height: 44px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 20px; z-index: 99990; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.3);`;
        btn.addEventListener('click', togglePanel);
        document.body.appendChild(btn);
    }

    function togglePanel() {
        const p = document.getElementById('addon-pack-panel');
        if (p) p.remove();
        else showPanel();
    }

    function showPanel() {
        const panel = document.createElement('div');
        panel.id = 'addon-pack-panel';
        panel.style.cssText = `position: fixed; bottom: 110px; right: 15px; width: 300px; background: rgba(15,15,25,0.98); border: 2px solid rgba(102,126,234,0.4); border-radius: 12px; color: #fff; z-index: 99991; box-shadow: 0 8px 32px rgba(0,0,0,0.5); overflow: hidden;`;

        const settings = JSON.parse(localStorage.getItem('addonPackSettings') || '{}');
        
        let html = `<div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 12px; border-bottom: 1px solid rgba(102,126,234,0.3);"><h2 style="margin: 0; font-size: 16px;">📦 Addon Pack</h2></div><div style="padding: 10px;">`;

        ADDONS.forEach(addon => {
            const enabled = settings[addon.id]?.enabled || false;
            const color = enabled ? '#4ade80' : '#ef4444';
            const btnText = enabled ? 'Wyłącz' : 'Włącz';
            
            html += `<div style="background: rgba(50,50,70,0.4); border: 1px solid rgba(102,126,234,0.2); border-radius: 8px; padding: 10px; margin-bottom: 8px;"><h3 style="margin: 0 0 6px 0; color: #667eea; font-size: 13px;">${addon.name}</h3><div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-size: 11px; color: ${color};">● ${enabled ? 'Włączony' : 'Wyłączony'}</span><button class="addon-toggle" data-id="${addon.id}" style="padding: 6px 12px; background: ${enabled ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}; border: 1px solid ${color}; color: ${color}; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: bold;">${btnText}</button></div></div>`;
        });

        html += `</div>`;
        panel.innerHTML = html;
        document.body.appendChild(panel);

        panel.querySelectorAll('.addon-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                toggleAddon(id);
            });
        });
    }

    function toggleAddon(id) {
        const settings = JSON.parse(localStorage.getItem('addonPackSettings') || '{}');
        const enabled = settings[id]?.enabled || false;
        
        if (!enabled) loadAddon(id);
        else unloadAddon(id);
        
        settings[id] = { enabled: !enabled };
        localStorage.setItem('addonPackSettings', JSON.stringify(settings));
        showPanel();
    }

    function loadAddon(id) {
        const addon = ADDONS.find(a => a.id === id);
        if (!addon || document.getElementById(`addon-${id}`)) return;

        fetch(BASE + addon.url + '?v=' + Date.now())
            .then(r => r.text())
            .then(code => {
                const s = document.createElement('script');
                s.id = `addon-${id}`;
                s.textContent = code;
                document.body.appendChild(s);
            })
            .catch(e => console.error(`✗ ${addon.name}:`, e));
    }

    function unloadAddon(id) {
        const s = document.getElementById(`addon-${id}`);
        if (s) s.remove();
    }

    // === INIT ===
    createButton();
    const settings = JSON.parse(localStorage.getItem('addonPackSettings') || '{}');
    ADDONS.forEach(addon => {
        if (settings[addon.id]?.enabled) loadAddon(addon.id);
    });
})();
