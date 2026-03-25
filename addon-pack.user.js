// ==UserScript==
// @name         Margonem Addon Pack
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Panel zarządzania dodatkami do gry Margonem
// @author       Kruul
// @match        https://*.margonem.pl/
// @exclude      https://*.margonem.pl/login/*
// @exclude      https://*.margonem.pl/register/*
// @updateURL    https://raw.githubusercontent.com/kruulxd/Addon-Pack/main/addon-pack.user.js
// @downloadURL  https://raw.githubusercontent.com/kruulxd/Addon-Pack/main/addon-pack.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        REPO_BASE_URL: 'https://raw.githubusercontent.com/kruulxd/Addon-Pack/main',
        ADDONS: [
            {
                id: 'ulepszarka',
                name: 'Ulepszarka',
                description: 'Auto ulepszanie i rozbijanie',
                url: '/addons/ulepszarka/ulepszarka-addon.js'
            },
            {
                id: 'iledoe2',
                name: 'Za ile respi',
                description: 'Timery elit II i tytanów',
                url: '/addons/iledoe2/iledoe2-addon.js'
            }
        ]
    };

    class AddonPack {
        constructor() {
            this.loadedAddons = {};
            this.settings = this.loadSettings();
            this.init();
        }

        loadSettings() {
            const stored = localStorage.getItem('addonPackSettings');
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error('Błąd ładowania ustawień:', e);
                }
            }
            
            const defaults = {};
            CONFIG.ADDONS.forEach(addon => {
                defaults[addon.id] = { enabled: false };
            });
            
            return defaults;
        }

        saveSettings() {
            localStorage.setItem('addonPackSettings', JSON.stringify(this.settings));
        }

        async loadAddon(addon) {
            if (this.loadedAddons[addon.id]) {
                return true;
            }

            try {
                const addonUrl = CONFIG.REPO_BASE_URL + addon.url + '?v=' + Date.now();
                const response = await fetch(addonUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const code = await response.text();
                const script = document.createElement('script');
                script.textContent = code;
                script.id = `addon-${addon.id}`;
                document.body.appendChild(script);
                
                this.loadedAddons[addon.id] = true;
                console.log(`✓ Addon załadowany: ${addon.name}`);
                
                return true;
            } catch (error) {
                console.error(`✗ Błąd ładowania addonu ${addon.name}:`, error);
                return false;
            }
        }

        unloadAddon(addon) {
            const script = document.getElementById(`addon-${addon.id}`);
            if (script) {
                script.remove();
                delete this.loadedAddons[addon.id];
                console.log(`✓ Addon unloadowany: ${addon.name}`);
            }
        }

        async toggleAddon(addonId, enabled) {
            const addon = CONFIG.ADDONS.find(a => a.id === addonId);
            if (!addon) return;

            if (enabled) {
                if (await this.loadAddon(addon)) {
                    this.settings[addonId] = { enabled: true };
                    this.saveSettings();
                }
            } else {
                this.unloadAddon(addon);
                this.settings[addonId] = { enabled: false };
                this.saveSettings();
            }

            this.updatePanelUI();
        }

        createPanelButton() {
            const button = document.createElement('div');
            button.id = 'addon-pack-button';
            button.innerHTML = '📦';
            button.title = 'Addon Pack - Panel dodatków';
            
            button.style.cssText = `
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
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `;

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.1)';
                button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            });

            button.addEventListener('click', () => this.togglePanel());

            document.body.appendChild(button);
        }

        togglePanel() {
            const existingPanel = document.getElementById('addon-pack-panel');
            if (existingPanel) {
                existingPanel.remove();
                return;
            }

            this.createPanel();
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'addon-pack-panel';
            
            panel.style.cssText = `
                position: fixed;
                bottom: 110px;
                right: 15px;
                width: 300px;
                background: rgba(15, 15, 25, 0.98);
                border: 2px solid rgba(102, 126, 234, 0.4);
                border-radius: 12px;
                color: #fff;
                z-index: 99991;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                font-family: 'Arial', sans-serif;
                overflow: hidden;
                backdrop-filter: blur(10px);
            `;

            let html = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-bottom: 1px solid rgba(102, 126, 234, 0.3);">
                    <h2 style="margin: 0; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <span>📦</span>
                        <span>Addon Pack</span>
                    </h2>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(255, 255, 255, 0.7);">Zarządzanie dodatkami</p>
                </div>
                <div style="padding: 10px; max-height: 400px; overflow-y: auto;">
            `;

            CONFIG.ADDONS.forEach(addon => {
                const isEnabled = this.settings[addon.id]?.enabled || false;
                const statusColor = isEnabled ? '#4ade80' : '#ef4444';
                const statusText = isEnabled ? 'Włączony' : 'Wyłączony';
                
                html += `
                    <div class="addon-item" data-addon-id="${addon.id}" style="
                        background: rgba(50, 50, 70, 0.4);
                        border: 1px solid rgba(102, 126, 234, 0.2);
                        border-radius: 8px;
                        padding: 10px;
                        margin-bottom: 8px;
                        transition: all 0.2s;
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 6px;">
                            <div>
                                <h3 style="margin: 0; font-size: 13px; font-weight: bold; color: #667eea;">${addon.name}</h3>
                                <p style="margin: 3px 0 0 0; font-size: 11px; color: #aaa;">${addon.description}</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; color: ${statusColor}; font-weight: bold;">● ${statusText}</span>
                            <button class="addon-toggle-btn" data-addon-id="${addon.id}" style="
                                padding: 6px 12px;
                                background: ${isEnabled ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
                                border: 1px solid ${isEnabled ? '#4ade80' : '#ef4444'};
                                color: ${isEnabled ? '#4ade80' : '#ef4444'};
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 11px;
                                font-weight: bold;
                                transition: all 0.2s;
                            ">
                                ${isEnabled ? 'Wyłącz' : 'Włącz'}
                            </button>
                        </div>
                    </div>
                `;
            });

            html += `
                </div>
                <div style="border-top: 1px solid rgba(102, 126, 234, 0.2); padding: 8px; background: rgba(0, 0, 0, 0.3);">
                    <p style="margin: 0; font-size: 10px; color: #999; text-align: center;">
                        v1.0.0 • Repo: 
                        <a href="https://github.com/kruulxd/Addon-Pack" target="_blank" style="color: #667eea; text-decoration: none;">GitHub</a>
                    </p>
                </div>
            `;

            panel.innerHTML = html;
            document.body.appendChild(panel);

            panel.querySelectorAll('.addon-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const addonId = btn.getAttribute('data-addon-id');
                    const isCurrentlyEnabled = this.settings[addonId]?.enabled;
                    this.toggleAddon(addonId, !isCurrentlyEnabled);
                });
            });

            setTimeout(() => {
                document.addEventListener('click', (e) => {
                    if (!panel.contains(e.target) && e.target.id !== 'addon-pack-button') {
                        panel.remove();
                        document.removeEventListener('click', arguments.callee);
                    }
                });
            }, 100);
        }

        updatePanelUI() {
            const panel = document.getElementById('addon-pack-panel');
            if (panel) {
                panel.remove();
                this.createPanel();
            }
        }

        autoLoadAddons() {
            CONFIG.ADDONS.forEach(addon => {
                if (this.settings[addon.id]?.enabled) {
                    this.loadAddon(addon);
                }
            });
        }

        init() {
            this.createPanelButton();
            this.autoLoadAddons();
            console.log('✓ Addon Pack załadowany');
        }
    }

    function waitForEngine(callback) {
        if (window.Engine?.allInit && typeof window._g === 'function') {
            callback();
        } else {
            setTimeout(() => waitForEngine(callback), 100);
        }
    }

    waitForEngine(() => {
        window.addonPack = new AddonPack();
    });
})();
