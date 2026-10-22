// Robust SHA-256 supporting native Web Crypto and pure JS fallback
function pureJsSha256(ascii) {
    function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
    const mathPow = Math.pow, maxWord = mathPow(2, 32);
    let i, j, result = '', words = [];
    const asciiBitLength = ascii.length * 8;
    const hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const k = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    let wordsLen = ascii.length;
    for (i = 0; i < wordsLen; i++) words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << ((3 - i % 4) * 8);
    words[wordsLen >> 2] |= 0x80 << ((3 - wordsLen % 4) * 8);
    words[(((wordsLen + 8) >> 6) << 4) + 15] = asciiBitLength;
    const w = new Array(64);
    for (i = 0; i < words.length; i += 16) {
        let [a, b, c, d, e, f, g, h] = hash;
        for (j = 0; j < 64; j++) {
            if (j < 16) w[j] = words[i + j] | 0;
            else {
                const gamma0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
                const gamma1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
                w[j] = (w[j - 16] + gamma0 + w[j - 7] + gamma1) | 0;
            }
            const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
            const ch = (e & f) ^ ((~e) & g);
            const temp1 = (h + s1 + ch + k[j] + w[j]) | 0;
            const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (s0 + maj) | 0;
            h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
        }
        hash[0] = (hash[0] + a) | 0; hash[1] = (hash[1] + b) | 0; hash[2] = (hash[2] + c) | 0; hash[3] = (hash[3] + d) | 0;
        hash[4] = (hash[4] + e) | 0; hash[5] = (hash[5] + f) | 0; hash[6] = (hash[6] + g) | 0; hash[7] = (hash[7] + h) | 0;
    }
    return hash.map(val => (val >>> 0).toString(16).padStart(8, '0')).join('');
}

async function sha256(message) {
    if (window.crypto && window.crypto.subtle) {
        try {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        } catch {
            return pureJsSha256(message);
        }
    }
    return pureJsSha256(message);
}

// In-memory Blockchain
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = '';
        this.miningTimeMs = 0;
        this.energyJoules = 0;
    }
}

let chain = [];
let isMining = false;

// Initialize with Genesis Block
async function initGenesis() {
    const genesis = new Block(0, new Date().toISOString(), 'Genesis Block - Antigravity Blockchain', '0000000000000000000000000000000000000000000000000000000000000000');
    genesis.hash = await sha256(genesis.index + genesis.previousHash + genesis.timestamp + genesis.data + genesis.nonce);
    chain.push(genesis);
    renderChain();
}

function renderChain() {
    const container = document.getElementById('chain-blocks');
    container.innerHTML = '';

    chain.forEach(block => {
        const div = document.createElement('div');
        div.className = 'block-card';
        div.innerHTML = `
            <div class="block-header">
                <span class="block-title">Block #${block.index}</span>
                <span style="font-size: 0.75rem; color: #94a3b8;">${new Date(block.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="block-field">Data: <span>${typeof block.data === 'string' ? block.data : JSON.stringify(block.data)}</span></div>
            <div class="block-field">Nonce: <span>${block.nonce.toLocaleString()}</span></div>
            <div class="block-field">Prev Hash: <span style="font-size:0.7rem; color:#94a3b8;">${block.previousHash.substring(0, 16)}...</span></div>
            <div class="block-field">Hash:</div>
            <div class="block-hash">${block.hash}</div>
            ${block.miningTimeMs ? `<div class="block-field" style="margin-top:8px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:4px;">
                Mined in <span>${block.miningTimeMs.toFixed(1)} ms</span> (${block.energyJoules.toFixed(4)} J)
            </div>` : ''}
        `;
        container.appendChild(div);
    });
}

// UI bindings
const difficultySlider = document.getElementById('difficulty-slider');
const difficultyDisplay = document.getElementById('difficulty-val');
const blockDataInput = document.getElementById('block-data');
const mineBtn = document.getElementById('mine-btn');

difficultySlider.addEventListener('input', (e) => {
    difficultyDisplay.textContent = e.target.value;
});

mineBtn.addEventListener('click', async () => {
    if (isMining) return;
    isMining = true;
    mineBtn.disabled = true;
    mineBtn.innerHTML = '<span>⚡ Mining in Progress...</span>';

    const difficulty = parseInt(difficultySlider.value);
    const target = '0'.repeat(difficulty);
    const data = blockDataInput.value.trim() || `Transaction: User sends ${Math.floor(Math.random() * 50) + 1} ETH`;
    const prevBlock = chain[chain.length - 1];

    const newBlock = new Block(chain.length, new Date().toISOString(), data, prevBlock.hash);

    const startTime = performance.now();
    let lastUiUpdate = startTime;
    let hashesSinceLastUpdate = 0;

    const currentHashEl = document.getElementById('current-hash');
    const nonceEl = document.getElementById('stat-nonce');
    const timeEl = document.getElementById('stat-time');
    const hashrateEl = document.getElementById('stat-hashrate');
    const energyEl = document.getElementById('stat-energy');

    while (true) {
        newBlock.nonce++;
        hashesSinceLastUpdate++;
        
        // Exact formula matching PDF:
        // calculateHash: index + previousHash + timestamp + data + nonce
        const content = newBlock.index + newBlock.previousHash + newBlock.timestamp + newBlock.data + newBlock.nonce;
        newBlock.hash = await sha256(content);

        // Periodically yield to browser to render animation smoothly
        const now = performance.now();
        if (now - lastUiUpdate > 50) {
            const elapsedTotal = now - startTime;
            const currentHashrate = Math.round((hashesSinceLastUpdate / ((now - lastUiUpdate) / 1000)));
            const energyJoules = 65 * (elapsedTotal / 1000); // 65W TDP model

            nonceEl.textContent = newBlock.nonce.toLocaleString();
            timeEl.textContent = elapsedTotal.toFixed(0) + ' ms';
            hashrateEl.textContent = currentHashrate.toLocaleString() + ' H/s';
            energyEl.textContent = energyJoules.toFixed(3) + ' J';
            currentHashEl.textContent = newBlock.hash;

            lastUiUpdate = now;
            hashesSinceLastUpdate = 0;
            // Short delay to avoid freezing event loop
            await new Promise(r => setTimeout(r, 0));
        }

        // Difficulty condition check
        if (newBlock.hash.startsWith(target)) {
            break;
        }
    }

    const endTime = performance.now();
    newBlock.miningTimeMs = endTime - startTime;
    newBlock.energyJoules = 65 * (newBlock.miningTimeMs / 1000);

    // Final UI update
    nonceEl.textContent = newBlock.nonce.toLocaleString();
    timeEl.textContent = newBlock.miningTimeMs.toFixed(1) + ' ms';
    hashrateEl.textContent = Math.round(newBlock.nonce / (newBlock.miningTimeMs / 1000)).toLocaleString() + ' H/s';
    energyEl.textContent = newBlock.energyJoules.toFixed(4) + ' J';
    
    // Highlight matched leading zeros
    const matched = newBlock.hash.substring(0, difficulty);
    const rest = newBlock.hash.substring(difficulty);
    currentHashEl.innerHTML = `<span class="target-matched">${matched}</span>${rest}`;

    chain.push(newBlock);
    renderChain();

    // Reset button
    mineBtn.disabled = false;
    mineBtn.innerHTML = '<span>⚡ Mine New Block</span>';
    isMining = false;
});

// Start with Genesis on load
initGenesis();
