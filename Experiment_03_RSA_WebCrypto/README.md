# PRACTICAL 3: RSA Public Key Encryption and Decryption Using Web Crypto API

## Aim
Write a Simple Web-Based Program to Implement RSA Public Key Encryption and Private Key Decryption Using the Web Crypto API.

---

## Objectives
- To understand asymmetric (public key) cryptography and the RSA algorithm.
- To generate public and private RSA key pairs using the standard W3C Web Crypto API.
- To encrypt a plaintext message with the public key and decrypt it with the corresponding private key.
- To understand RSA-OAEP (Optimal Asymmetric Encryption Padding) and verify tamper-resistance.

---

## Facilities
- Computer System
- Node.js Runtime (v18+) with native `crypto.webcrypto` support
- Modern Web Browser (Chrome, Firefox, Edge, Safari)

---

## Theory

### 1. Asymmetric Cryptography & RSA
RSA (Rivest–Shamir–Adleman) is an asymmetric cryptographic algorithm founded on the mathematical difficulty of factoring the product of two large prime numbers ($n = p \times q$):
- **Key Generation**:
  - Two distinct large primes $p$ and $q$ are chosen.
  - Modulus $n = p \times q$.
  - Euler's totient function $\phi(n) = (p-1)(q-1)$.
  - Public exponent $e$ is chosen such that $1 < e < \phi(n)$ and $\gcd(e, \phi(n)) = 1$ (commonly $65537$).
  - Private exponent $d$ is computed such that $d \cdot e \equiv 1 \pmod{\phi(n)}$.
  - **Public Key**: $(e, n)$
  - **Private Key**: $(d, n)$

- **Encryption**:
  $$c \equiv m^e \pmod n$$
- **Decryption**:
  $$m \equiv c^d \pmod n$$

### 2. RSA-OAEP (Optimal Asymmetric Encryption Padding)
Textbook RSA is deterministic and vulnerable to chosen-ciphertext attacks. RSA-OAEP introduces randomized padding using hash functions (e.g. SHA-256) and a Feistel-like network before modular exponentiation:
- Provides **semantic security** (encrypting the same message twice produces different ciphertexts).
- Detects unauthorized bit-flipping / cipher manipulation.

### 3. W3C Web Crypto API
The `crypto.subtle` interface provides non-blocking, hardware-accelerated cryptographic primitives natively in modern web browsers and modern Node.js environments (`crypto.webcrypto.subtle`).

---

## Procedure
1. Initialize the Web Crypto API using `crypto.subtle.generateKey()`.
2. Configure RSA-OAEP with `modulusLength: 2048`, `publicExponent: [1,0,1]` ($65537$), and `hash: 'SHA-256'`.
3. Export and display generated keys in SPKI (SubjectPublicKeyInfo) and PKCS#8 formats.
4. Encode the plaintext message into a `Uint8Array` using `TextEncoder`.
5. Encrypt the byte array using `crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, data)`.
6. Convert ciphertext to Base64/Hex for transmission/display.
7. Decrypt ciphertext using `crypto.subtle.decrypt({ name: 'RSA-OAEP' }, privateKey, ciphertext)`.
8. Decode using `TextDecoder` and verify that `decrypted === plaintext`.

---

## Code Snippet
```javascript
// Key Generation
const keys = await crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256"
  },
  true,
  ["encrypt", "decrypt"]
);

// Encrypt with Public Key
const ciphertext = await crypto.subtle.encrypt(
  { name: "RSA-OAEP" },
  keys.publicKey,
  new TextEncoder().encode("Hello Blockchain Security!")
);

// Decrypt with Private Key
const decrypted = await crypto.subtle.decrypt(
  { name: "RSA-OAEP" },
  keys.privateKey,
  ciphertext
);
console.log(new TextDecoder().decode(decrypted));
```

---

## How to Run
### Option A: CLI Terminal Execution
```bash
node Experiment_03_RSA_WebCrypto/rsa_node.js
```

### Option B: Interactive Web Visualizer
Open `Experiment_03_RSA_WebCrypto/index.html` in your browser or run:
```bash
npm start
# Navigate to http://localhost:3000/Experiment_03_RSA_WebCrypto/
```

---

## Output
```
==============================================================================
 PRACTICAL 3: RSA ASYMMETRIC ENCRYPTION & DECRYPTION (WEB CRYPTO API)
==============================================================================

[1] GENERATING RSA-OAEP 2048-BIT KEY PAIR:
    Algorithm: RSA-OAEP | Modulus: 2048-bit | Exponent: 65537 | Hash: SHA-256
    [✓] Public Key Generated  (SPKI):  30820122300d06092a864886f70d0101010500...
    [✓] Private Key Generated (PKCS8): 308204be020100300d06092a864886f70d01...

[2] ORIGINAL PLAINTEXT MESSAGE:
    "Blockchain Technology 7th Semester - RSA Secure Communication Demo"

[3] ENCRYPTING WITH RSA PUBLIC KEY (RSA-OAEP):
    Ciphertext (Hex, 256 bytes)    : 43eeeeea92369e2c2fce593d2e2f94d74c770...
    Ciphertext (Base64)             : Q+7u6pI2niwvzlk9Li+U10x3CjZQh0sAhWR1Y...

[4] DECRYPTING WITH RSA PRIVATE KEY:
    Decrypted Message               : "Blockchain Technology 7th Semester - RSA Secure Communication Demo"

[5] VERIFICATION RESULT:
    Match Status: [✓] SUCCESS (Original === Decrypted)

[6] INTEGRITY & TAMPER DETECTION DEMONSTRATION:
    Simulating an in-transit man-in-the-middle bit flip in ciphertext...
    [✓] Decryption safely rejected tampered ciphertext!
        Cryptographic Error: OperationError (OAEP padding verification failed)

==============================================================================
 OUTPUT: Original message -> Encrypted message -> Decrypted message.
==============================================================================
```

---

## Conclusion
RSA public key encryption and private key decryption were successfully implemented using the Web Crypto API. The decrypted plaintext matched the original message identically, validating asymmetric cryptography principles. Furthermore, tampering with encrypted ciphertext resulted in immediate OAEP integrity check failure, proving the integrity guarantee of modern padded asymmetric schemes.
