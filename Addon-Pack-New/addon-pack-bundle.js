// Addon Pack Bundle - Menu & Manager
(function() {
    'use strict';

    // Helper do ładowania sub-bundli z czekaniem na Engine
    window.waitForEngine = function(callback) {
        if (window.Engine?.allInit) {
            callback();
        } else {
            setTimeout(() => window.waitForEngine(callback), 500);
        }
    };

    const ADDON_PACK_VERSION = '1.0.0';
    const REPO_BASE = 'https://raw.githubusercontent.com/kruulxd/Addon-Pack/refs/heads/main';
    
    const ADDONS = [
        {
            id: 'ulepszarka',
            name: 'Ulepszarka',
            description: 'System automatycznego ulepszania i rozbijania przedmiotów',
            version: '0.1.8',
            enabled: true,
            icon: '⚒️'
        },
        {
            id: 'za-ile-respi',
            name: 'Za ile respi',
            description: 'Timery respawnów dla Elite II i Titanów',
            version: '1.4',
            enabled: true,
            icon: '⏱️'
        }
    ];

    // ==================== STORAGE ====================
    const Storage = {
        getAddonState() {
            try {
                const saved = localStorage.getItem('addon-pack:state');
                return saved ? JSON.parse(saved) : {};
            } catch (e) {
                return {};
            }
        },

        saveAddonState(addonId, enabled) {
            try {
                const state = Storage.getAddonState();
                state[addonId] = enabled;
                localStorage.setItem('addon-pack:state', JSON.stringify(state));
            } catch (e) {
                console.error('[Addon Pack] Błąd przy zapisie stanu:', e);
            }
        },

        isAddonEnabled(addonId) {
            const state = Storage.getAddonState();
            return state.hasOwnProperty(addonId) ? state[addonId] : true;
        }
    };

    // ==================== ADDON LOADER ====================
    const AddonLoader = {
        async loadAddon(addon) {
            if (!addon.id) {
                console.warn(`[Addon Pack] Brak ID dla dodatku`);
                return false;
            }

            try {
                // Ładuj przez wrapper function z loadera (obejście CSP)
                if (window.addonPackLoadSubBundle) {
                    window.addonPackLoadSubBundle(addon);
                } else {
                    console.error(`[Addon Pack] addonPackLoadSubBundle nie dostępny`);
                }
                return true;
            } catch (e) {
                console.error(`[Addon Pack] Błąd przy ładowaniu ${addon.id}:`, e);
                return false;
            }
        },

        async loadEnabledAddons() {
            for (const addon of ADDONS) {
                const isEnabled = Storage.isAddonEnabled(addon.id);
                if (isEnabled) {
                    console.log(`[Addon Pack] Ładuję: ${addon.name}...`);
                    await this.loadAddon(addon);
                }
            }
        }
    };

    // ==================== UI - MENU ====================
    const AddonUI = {
        setupCss() {
            const css = `
                .addon-pack-menu-btn {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(100, 60, 160, 0.8), rgba(130, 75, 180, 0.8));
                    border: 2px solid rgba(100, 60, 160, 0.6);
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                }
                
                .addon-pack-menu-btn:hover {
                    background: linear-gradient(135deg, rgba(120, 80, 180, 0.9), rgba(150, 95, 200, 0.9));
                    box-shadow: 0 6px 20px rgba(100, 60, 160, 0.5);
                    transform: scale(1.1);
                }
                
                .addon-pack-menu-btn:active {
                    transform: scale(0.95);
                }

                .addon-pack-panel {
                    position: fixed;
                    bottom: 80px;
                    left: 20px;
                    width: 320px;
                    background: rgba(20, 20, 30, 0.95);
                    border: 2px solid rgba(100, 60, 160, 0.6);
                    border-radius: 12px;
                    color: #fff;
                    z-index: 9997;
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                }
                
                .addon-pack-panel.active {
                    max-height: 500px;
                    opacity: 1;
                }

                .addon-pack-panel-header {
                    padding: 16px;
                    border-bottom: 1px solid rgba(100, 60, 160, 0.3);
                    background: linear-gradient(135deg, rgba(100, 60, 160, 0.2), rgba(80, 40, 140, 0.2));
                    font-size: 14px;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .addon-pack-panel-version {
                    font-size: 11px;
                    opacity: 0.7;
                }

                .addon-pack-panel-content {
                    padding: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .addon-pack-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: rgba(50, 50, 70, 0.5);
                    border-radius: 8px;
                    border: 1px solid rgba(100, 60, 160, 0.2);
                    transition: all 0.2s;
                }

                .addon-pack-item:hover {
                    background: rgba(60, 60, 90, 0.7);
                    border-color: rgba(100, 60, 160, 0.4);
                }

                .addon-pack-toggle {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 42px;
                    height: 24px;
                    background: rgba(100, 100, 120, 0.5);
                    border: 1px solid rgba(150, 150, 180, 0.3);
                    border-radius: 12px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s;
                    margin-right: 12px;
                    flex-shrink: 0;
                }

                .addon-pack-toggle::before {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: #fff;
                    border-radius: 50%;
                    top: 2px;
                    left: 2px;
                    transition: all 0.3s;
                }

                .addon-pack-toggle:checked {
                    background: rgba(100, 200, 100, 0.5);
                    border-color: rgba(100, 200, 100, 0.7);
                }

                .addon-pack-toggle:checked::before {
                    left: 20px;
                }

                .addon-pack-info {
                    flex: 1;
                }

                .addon-pack-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 2px;
                }

                .addon-pack-desc {
                    font-size: 11px;
                    opacity: 0.7;
                    line-height: 1.3;
                }

                .addon-pack-panel-footer {
                    padding: 12px;
                    border-top: 1px solid rgba(100, 60, 160, 0.2);
                    font-size: 10px;
                    opacity: 0.6;
                    text-align: center;
                }

                .addon-pack-toast {
                    position: fixed;
                    bottom: 100px;
                    left: 20px;
                    background: rgba(50, 50, 70, 0.95);
                    border: 1px solid rgba(100, 200, 100, 0.5);
                    border-radius: 8px;
                    padding: 12px 16px;
                    color: #fff;
                    font-size: 12px;
                    z-index: 9999;
                    animation: slideInLeft 0.3s ease;
                    backdrop-filter: blur(10px);
                }

                @keyframes slideInLeft {
                    from {
                        transform: translateX(-400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutLeft {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-400px);
                        opacity: 0;
                    }
                }

                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(50, 50, 70, 0.3);
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(100, 60, 160, 0.5);
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(100, 60, 160, 0.7);
                }
            `;

            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        },

        createMenu() {
            // Button
            const btn = document.createElement('button');
            btn.id = 'addon-pack-menu-btn';
            btn.className = 'addon-pack-menu-btn';
            btn.innerHTML = '⚙️';
            btn.title = 'Addon Pack Menu';

            // Panel
            const panel = document.createElement('div');
            panel.id = 'addon-pack-panel';
            panel.className = 'addon-pack-panel';

            // Header
            const header = document.createElement('div');
            header.className = 'addon-pack-panel-header';
            header.innerHTML = `
                Addon Pack
                <span class="addon-pack-panel-version">v${ADDON_PACK_VERSION}</span>
            `;

            // Content
            const content = document.createElement('div');
            content.className = 'addon-pack-panel-content';

            ADDONS.forEach((addon) => {
                const isEnabled = Storage.isAddonEnabled(addon.id);

                const item = document.createElement('div');
                item.className = 'addon-pack-item';

                const toggle = document.createElement('input');
                toggle.type = 'checkbox';
                toggle.className = 'addon-pack-toggle';
                toggle.checked = isEnabled;
                toggle.dataset.addonId = addon.id;

                const info = document.createElement('div');
                info.className = 'addon-pack-info';
                info.innerHTML = `
                    <div class="addon-pack-name">${addon.icon} ${addon.name}</div>
                    <div class="addon-pack-desc">${addon.description}</div>
                `;

                toggle.addEventListener('change', (e) => {
                    Storage.saveAddonState(addon.id, e.target.checked);
                    AddonUI.showToast(
                        e.target.checked
                            ? `${addon.name}: będzie załadowany (zmiana wymaga przeładowania)`
                            : `${addon.name}: wyłączony (zmiana wymaga przeładowania)`
                    );
                });

                item.appendChild(toggle);
                item.appendChild(info);
                content.appendChild(item);
            });

            // Footer
            const footer = document.createElement('div');
            footer.className = 'addon-pack-panel-footer';
            footer.textContent = 'Zmiany wymagają przeładowania strony';

            panel.appendChild(header);
            panel.appendChild(content);
            panel.appendChild(footer);

            document.body.appendChild(btn);
            document.body.appendChild(panel);

            btn.addEventListener('click', () => {
                AddonUI.togglePanel();
            });
        },

        togglePanel() {
            const panel = document.getElementById('addon-pack-panel');
            if (panel) {
                panel.classList.toggle('active');
            }
        },

        showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'addon-pack-toast';
            toast.textContent = message;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.animation = 'slideOutLeft 0.3s ease';
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 2000);
        }
    };

    function init() {
        console.log(`[Addon Pack] Initializing v${ADDON_PACK_VERSION}`);
        
        AddonUI.setupCss();
        AddonUI.createMenu();
        AddonLoader.loadEnabledAddons();
    }

    // Inicjalizuj od razu
    init();

})();
