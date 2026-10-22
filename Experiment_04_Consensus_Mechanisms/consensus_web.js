// Web SHA-256 helper
async function computeSha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuf = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// State
let powBlockIndex = 0;
let posBlockIndex = 0;
let lastPowHash = '00000000000000000000000000000000';
let lastPosHash = '00000000000000000000000000000000';

const powBtn = document.getElementById('pow-btn');
const posBtn = document.getElementById('pos-btn');

const powNonceEl = document.getElementById('pow-nonce');
const powTimeEl = document.getElementById('pow-time');
const powEnergyEl = document.getElementById('pow-energy');
const powHashEl = document.getElementById('pow-hash');

const posValidatorEl = document.getElementById('pos-validator');
const posTimeEl = document.getElementById('pos-time');
const posEnergyEl = document.getElementById('pos-energy');
const posHashEl = document.getElementById('pos-hash');

const comparisonTbody = document.getElementById('comparison-tbody');

// Proof of Work simulation
powBtn.addEventListener('click', async () => {
    powBtn.disabled = true;
    powBtn.textContent = 'Mining PoW Block...';

    powBlockIndex++;
    let nonce = 0;
    let hash = '';
    const difficulty = '000';
    const startTime = performance.now();

    while (true) {
        nonce++;
        hash = await computeSha256(powBlockIndex + lastPowHash + nonce);
        if (hash.startsWith(difficulty)) break;

        // Periodic yield
        if (nonce % 200 === 0) {
            powNonceEl.textContent = nonce.toLocaleString();
            powHashEl.textContent = hash;
            await new Promise(r => setTimeout(r, 0));
        }
    }

    const duration = performance.now() - startTime;
    const energy = 65 * (duration / 1000); // 65W TDP
    lastPowHash = hash;

    powNonceEl.textContent = nonce.toLocaleString();
    powTimeEl.textContent = duration.toFixed(1) + ' ms';
    powEnergyEl.textContent = energy.toFixed(4) + ' J';
    powHashEl.textContent = hash;

    // Dynamically pick winning miner weighted by hashrate
    const miners = [
        { name: 'Miner_Alpha (40%)', power: 40 },
        { name: 'Miner_Beta (35%)', power: 35 },
        { name: 'Miner_Gamma (25%)', power: 25 }
    ];
    let rand = Math.random() * 100;
    let chosenMiner = miners[0];
    for (const m of miners) {
        if (rand < m.power) { chosenMiner = m; break; }
        rand -= m.power;
    }

    addComparisonRow('PoW', powBlockIndex, chosenMiner.name, duration, energy, nonce, hash);

    powBtn.disabled = false;
    powBtn.textContent = 'Mine Next PoW Block (Target: 000...)';
});

// Proof of Stake simulation
posBtn.addEventListener('click', async () => {
    posBtn.disabled = true;
    posBlockIndex++;

    const validators = [
        { name: 'Alice', stake: 50 },
        { name: 'Bob', stake: 30 },
        { name: 'Charlie', stake: 20 }
    ];

    const startTime = performance.now();

    // Weighted random selection based on stake
    const totalStake = 100;
    let rand = Math.random() * totalStake;
    let chosen = validators[0];
    for (const v of validators) {
        if (rand < v.stake) {
            chosen = v;
            break;
        }
        rand -= v.stake;
    }

    const hash = await computeSha256(posBlockIndex + lastPosHash + chosen.name);
    const duration = performance.now() - startTime;
    const energy = 0.05 * (duration / 1000); // 0.05W signature check
    lastPosHash = hash;

    posValidatorEl.textContent = `${chosen.name} (${chosen.stake}% stake)`;
    posTimeEl.textContent = duration.toFixed(3) + ' ms';
    posEnergyEl.textContent = (energy * 1000).toFixed(6) + ' mJ';
    posHashEl.textContent = hash;

    addComparisonRow('PoS', posBlockIndex, chosen.name, duration, energy, 0, hash);

    posBtn.disabled = false;
});

function addComparisonRow(protocol, index, actor, timeMs, energyJ, nonce, hash) {
    const tr = document.createElement('tr');
    const formattedTime = timeMs < 0.01 ? `${timeMs.toFixed(3)} ms` : `${timeMs.toFixed(2)} ms`;
    tr.innerHTML = `
        <td style="color:${protocol === 'PoW' ? '#f59e0b' : '#10b981'}; font-weight:bold;">${protocol}</td>
        <td>Block #${index}</td>
        <td>${actor}</td>
        <td>${nonce > 0 ? nonce.toLocaleString() : 'N/A (Stake)'}</td>
        <td>${formattedTime}</td>
        <td>${protocol === 'PoW' ? energyJ.toFixed(4) + ' J' : (energyJ * 1000).toFixed(5) + ' mJ'}</td>
        <td style="font-size:0.7rem; color:#94a3b8;">${hash.substring(0, 16)}...</td>
    `;
    comparisonTbody.prepend(tr);
}
