// Web SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

const defaultTxs = [
    "Alice -> Bob: 10 ETH",
    "Bob -> Charlie: 5 ETH",
    "Charlie -> Dave: 2 ETH",
    "Dave -> Eve: 1 ETH"
];

let originalHashes = [];
let originalRoot = '';
let originalBlockHash = '';

const statusBanner = document.getElementById('status-banner');
const blockHashDisplay = document.getElementById('block-hash-display');
const resetBtn = document.getElementById('reset-btn');

const txInputs = [
    document.getElementById('tx-0'),
    document.getElementById('tx-1'),
    document.getElementById('tx-2'),
    document.getElementById('tx-3')
];

const txHashEls = [
    document.getElementById('tx-hash-0'),
    document.getElementById('tx-hash-1'),
    document.getElementById('tx-hash-2'),
    document.getElementById('tx-hash-3')
];

const parent01El = document.getElementById('parent-01-hash');
const parent23El = document.getElementById('parent-23-hash');
const rootEl = document.getElementById('root-hash');

const parent01Node = document.getElementById('parent-01-node');
const parent23Node = document.getElementById('parent-23-node');
const rootNode = document.getElementById('root-node');

async function initializeOriginals() {
    originalHashes = [];
    for (let tx of defaultTxs) {
        originalHashes.push(await sha256(tx));
    }
    const h01 = await sha256(originalHashes[0] + originalHashes[1]);
    const h23 = await sha256(originalHashes[2] + originalHashes[3]);
    originalRoot = await sha256(h01 + h23);
    originalBlockHash = await sha256("Block#1" + originalRoot + "Nonce:1042");
    await renderTree();
}

async function renderTree() {
    const currentTxs = txInputs.map(input => input.value.trim());
    const currentLeafHashes = [];
    let isTampered = false;

    // Level 0: Leaf Hashes
    for (let i = 0; i < 4; i++) {
        const hash = await sha256(currentTxs[i]);
        currentLeafHashes.push(hash);
        txHashEls[i].textContent = hash.substring(0, 24) + '...';

        const box = txInputs[i].closest('.tx-box');
        if (currentTxs[i] !== defaultTxs[i]) {
            isTampered = true;
            box.classList.add('tampered');
            txHashEls[i].classList.add('tampered');
        } else {
            box.classList.remove('tampered');
            txHashEls[i].classList.remove('tampered');
        }
    }

    // Level 1: Parent Hashes
    const h01 = await sha256(currentLeafHashes[0] + currentLeafHashes[1]);
    const h23 = await sha256(currentLeafHashes[2] + currentLeafHashes[3]);

    parent01El.textContent = h01.substring(0, 24) + '...';
    parent23El.textContent = h23.substring(0, 24) + '...';

    // Mark Level 1 nodes tampered if children differ
    const p01Tampered = (currentLeafHashes[0] !== originalHashes[0] || currentLeafHashes[1] !== originalHashes[1]);
    const p23Tampered = (currentLeafHashes[2] !== originalHashes[2] || currentLeafHashes[3] !== originalHashes[3]);

    parent01Node.classList.toggle('tampered', p01Tampered);
    parent01El.classList.toggle('tampered', p01Tampered);

    parent23Node.classList.toggle('tampered', p23Tampered);
    parent23El.classList.toggle('tampered', p23Tampered);

    // Level 2: Merkle Root
    const currentRoot = await sha256(h01 + h23);
    rootEl.textContent = currentRoot;

    const rootTampered = (currentRoot !== originalRoot);
    rootNode.classList.toggle('tampered', rootTampered);
    rootEl.classList.toggle('tampered', rootTampered);

    // Block Hash Calculation
    const currentBlockHash = await sha256("Block#1" + currentRoot + "Nonce:1042");
    blockHashDisplay.textContent = currentBlockHash;

    // Status Banner update
    if (isTampered || rootTampered) {
        statusBanner.className = 'status-banner tampered';
        statusBanner.innerHTML = `⚠️ TAMPER DETECTED: Merkle Root Mismatch! Block Hash Invalidated.`;
        blockHashDisplay.style.color = '#ef4444';
    } else {
        statusBanner.className = 'status-banner valid';
        statusBanner.innerHTML = `🛡️ BLOCK INTEGRITY VALID: Merkle Root & Block Hash Verified.`;
        blockHashDisplay.style.color = '#38bdf8';
    }
}

// Bind live input listeners
txInputs.forEach(input => {
    input.addEventListener('input', renderTree);
});

resetBtn.addEventListener('click', () => {
    txInputs.forEach((input, i) => {
        input.value = defaultTxs[i];
    });
    renderTree();
});

initializeOriginals();
