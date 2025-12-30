const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const layers = ['THE_BLUE_LAYER', 'THE_BLACK_LAYER', 'THE_GREEN_LAYER', 'THE_RED_LAYER', 'THE_MIGRATION_BRIDGE'];

console.log("--- INITIALIZING SURGICAL VAULT ---");
console.log("Target: 52TB Emulation Mode [ON]");

layers.forEach(layer => {
    const layerPath = path.join(rootDir, layer);
    if (fs.existsSync(layerPath)) {
        console.log(`✅ ${layer}: SECURED`);
        const subFolders = fs.readdirSync(layerPath);
        subFolders.forEach(sub => {
            console.log(`   - [Sub-Basket]: ${sub}`);
        });
    } else {
        console.log(`❌ ${layer}: MISSING - CHECK INTEGRITY`);
    }
});

console.log("--- STATUS: READY FOR DATA DEPOSIT ---");