# Development Guide

## Local Testing

1. **Clone repository**: `git clone https://github.com/kruulxd/Addon-Pack.git`
2. **Install Tampermonkey** extension
3. **Edit addon-pack.user.js** - add after `const REPO_BASE`:

```javascript
// For local development, use file:// path
const REPO_BASE = 'file:///C:/Users/Kruul/Desktop/Addon-Pack-New';
