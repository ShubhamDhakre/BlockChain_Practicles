/**
 * EXPERIMENT 3: RSA Public Key Encryption and Private Key Decryption
 * Using Node.js Native Web Crypto API (crypto.webcrypto.subtle)
 * 
 * Aim: Write a Simple Web-Based Program to Implement RSA Public Key Encryption
 * and Private Key Decryption Using the Web Crypto API.
 */

const { subtle } = require('crypto').webcrypto;

// Helper: Convert ArrayBuffer to Hex string
function bufToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Helper: Convert ArrayBuffer to Base64
function bufToBase64(buffer) {
    return Buffer.from(buffer).toString('base64');
}

async function runRsaDemo() {
    console.log('='.repeat(78));
    console.log(' PRACTICAL 3: RSA ASYMMETRIC ENCRYPTION & DECRYPTION (WEB CRYPTO API)');
    console.log('='.repeat(78));

    // 1. Key Generation
    console.log('\n[1] GENERATING RSA-OAEP 2048-BIT KEY PAIR:');
    console.log('    Algorithm: RSA-OAEP | Modulus: 2048-bit | Exponent: 65537 | Hash: SHA-256');

    const keyPair = await subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );

    // Export keys to display their structures
    const spkiPublicKey = await subtle.exportKey("spki", keyPair.publicKey);
    const pkcs8PrivateKey = await subtle.exportKey("pkcs8", keyPair.privateKey);

    console.log('    [✓] Public Key Generated  (SPKI):  ' + bufToHex(spkiPublicKey).substring(0, 48) + '...');
    console.log('    [✓] Private Key Generated (PKCS8): ' + bufToHex(pkcs8PrivateKey).substring(0, 48) + '...');

    // 2. Plaintext Message
    const originalMessage = "Blockchain Technology 7th Semester - RSA Secure Communication Demo";
    console.log('\n[2] ORIGINAL PLAINTEXT MESSAGE:');
    console.log(`    "${originalMessage}" (Length: ${originalMessage.length} characters)`);

    // 3. Encrypt with Public Key
    console.log('\n[3] ENCRYPTING WITH RSA PUBLIC KEY (RSA-OAEP):');
    const encodedMessage = new TextEncoder().encode(originalMessage);

    const ciphertextBuffer = await subtle.encrypt(
        { name: "RSA-OAEP" },
        keyPair.publicKey,
        encodedMessage
    );

    const ciphertextHex = bufToHex(ciphertextBuffer);
    const ciphertextB64 = bufToBase64(ciphertextBuffer);

    console.log(`    Ciphertext (Hex, 256 bytes)    : ${ciphertextHex.substring(0, 64)}...`);
    console.log(`    Ciphertext (Base64)             : ${ciphertextB64.substring(0, 64)}...`);

    // 4. Decrypt with Private Key
    console.log('\n[4] DECRYPTING WITH RSA PRIVATE KEY:');
    const decryptedBuffer = await subtle.decrypt(
        { name: "RSA-OAEP" },
        keyPair.privateKey,
        ciphertextBuffer
    );

    const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
    console.log(`    Decrypted Message               : "${decryptedMessage}"`);

    // 5. Verification
    const isMatch = (originalMessage === decryptedMessage);
    console.log('\n[5] VERIFICATION RESULT:');
    console.log(`    Match Status: ${isMatch ? '[✓] SUCCESS (Original === Decrypted)' : '[x] FAILED'}`);

    // 6. Security Demonstration: Tamper Detection
    console.log('\n[6] INTEGRITY & TAMPER DETECTION DEMONSTRATION:');
    console.log('    Simulating an in-transit man-in-the-middle bit flip in ciphertext...');
    const tamperedArray = new Uint8Array(ciphertextBuffer);
    tamperedArray[10] ^= 0xFF; // Flip byte 10

    try {
        await subtle.decrypt(
            { name: "RSA-OAEP" },
            keyPair.privateKey,
            tamperedArray.buffer
        );
        console.log('    [x] Tampered message decrypted unexpectedly!');
    } catch (err) {
        console.log('    [✓] Decryption safely rejected tampered ciphertext!');
        console.log(`        Cryptographic Error: ${err.message || 'OperationError (OAEP padding verification failed)'}`);
    }

    console.log('\n' + '='.repeat(78));
    console.log(' OUTPUT: Original message -> Encrypted message -> Decrypted message.');
    console.log('='.repeat(78) + '\n');
}

runRsaDemo().catch(console.error);
