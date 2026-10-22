let keyPair = null;
let currentCiphertextBuffer = null;

const genKeyBtn = document.getElementById('gen-key-btn');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const tamperBtn = document.getElementById('tamper-btn');

const pubKeyEl = document.getElementById('pub-key-val');
const privKeyEl = document.getElementById('priv-key-val');
const plaintextInput = document.getElementById('plaintext-input');
const ciphertextOutput = document.getElementById('ciphertext-output');
const decryptedOutput = document.getElementById('decrypted-output');
const statusBox = document.getElementById('status-msg');

function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// 1. Key Generation
genKeyBtn.addEventListener('click', async () => {
    try {
        statusBox.textContent = 'Generating 2048-bit RSA-OAEP Key Pair...';
        
        // Exact API snippet from practical syllabus:
        keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]), // 65537
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );

        const exportedPub = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        const exportedPriv = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

        pubKeyEl.textContent = arrayBufferToHex(exportedPub);
        privKeyEl.textContent = arrayBufferToHex(exportedPriv);

        encryptBtn.disabled = false;
        statusBox.textContent = 'Key pair generated successfully! Ready to encrypt.';
    } catch (err) {
        statusBox.textContent = 'Error generating keys: ' + err.message;
    }
});

// 2. Encryption
encryptBtn.addEventListener('click', async () => {
    if (!keyPair) return;
    try {
        const text = plaintextInput.value || 'Antigravity Blockchain Practical 3';
        const encoded = new TextEncoder().encode(text);

        currentCiphertextBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            keyPair.publicKey,
            encoded
        );

        ciphertextOutput.value = arrayBufferToBase64(currentCiphertextBuffer);
        decryptBtn.disabled = false;
        tamperBtn.disabled = false;
        statusBox.textContent = 'Message encrypted successfully using RSA Public Key!';
    } catch (err) {
        statusBox.textContent = 'Encryption Error: ' + err.message;
    }
});

// 3. Decryption
decryptBtn.addEventListener('click', async () => {
    if (!keyPair || !currentCiphertextBuffer) return;
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            keyPair.privateKey,
            currentCiphertextBuffer
        );

        const decoded = new TextDecoder().decode(decrypted);
        decryptedOutput.value = decoded;
        
        const isMatch = (decoded === plaintextInput.value);
        statusBox.className = isMatch ? 'result-box' : 'result-box danger';
        statusBox.textContent = isMatch 
            ? 'Success: Decrypted message matches original message perfectly! (Original -> Encrypted -> Decrypted)'
            : 'Warning: Decrypted text differs from input.';
    } catch (err) {
        decryptedOutput.value = '';
        statusBox.className = 'result-box danger';
        statusBox.textContent = '❌ Decryption Failed: Cryptographic integrity error! ' + (err.message || 'RSA-OAEP padding check rejected tampered ciphertext.');
    }
});

// 4. Tamper Test
tamperBtn.addEventListener('click', async () => {
    if (!keyPair || !currentCiphertextBuffer) return;
    try {
        const tampered = new Uint8Array(currentCiphertextBuffer);
        tampered[5] ^= 0xFF; // Mutate byte 5
        currentCiphertextBuffer = tampered.buffer;
        ciphertextOutput.value = arrayBufferToBase64(currentCiphertextBuffer);
        decryptedOutput.value = '';

        statusBox.className = 'result-box danger';
        statusBox.textContent = '⚠️ Ciphertext mutated (1 byte flipped)! Now click "Decrypt with Private Key" to verify tamper rejection.';
    } catch (err) {
        statusBox.textContent = 'Tamper test error: ' + err.message;
    }
});

// Check Secure Context on load
if (!window.crypto || !window.crypto.subtle) {
    statusBox.className = 'result-box danger';
    statusBox.innerHTML = '⚠️ <strong>Secure Context Required:</strong> Web Crypto API requires HTTPS or <code>http://localhost:3000</code>. Please launch via <code>npm start</code>.';
    genKeyBtn.disabled = true;
}
