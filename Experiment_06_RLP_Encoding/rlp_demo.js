/**
 * EXPERIMENT 6: Recursive Length Prefix (RLP) Encoding & Decoding
 * 
 * Aim: Write a Simple Program to Understand RLP Encoding of Ethereum Transactions
 * Objectives:
 * - To understand RLP encoding used in Ethereum.
 * - To encode and decode an Ethereum transaction.
 * - To understand the difference between RLP and JSON.
 */

// Native pure-JS RLP implementation following the Ethereum Yellow Paper specification
class RLPEncoder {
    static toBuffer(val) {
        if (Buffer.isBuffer(val)) return val;
        if (typeof val === 'string') {
            if (val.startsWith('0x')) val = val.slice(2);
            // If valid hex string, parse as hex, else utf8
            if (/^[0-9a-fA-F]+$/.test(val) && val.length % 2 === 0) {
                return Buffer.from(val, 'hex');
            }
            return Buffer.from(val, 'utf8');
        }
        if (typeof val === 'number') {
            if (val === 0) return Buffer.alloc(0);
            let hex = val.toString(16);
            if (hex.length % 2 !== 0) hex = '0' + hex;
            return Buffer.from(hex, 'hex');
        }
        if (Array.isArray(val)) {
            return val.map(item => RLPEncoder.toBuffer(item));
        }
        return Buffer.alloc(0);
    }

    static encode(input) {
        if (Array.isArray(input)) {
            const output = [];
            for (let i = 0; i < input.length; i++) {
                output.push(RLPEncoder.encode(input[i]));
            }
            const buf = Buffer.concat(output);
            return RLPEncoder.encodeLength(buf.length, 192, buf);
        } else {
            const buf = RLPEncoder.toBuffer(input);
            if (buf.length === 1 && buf[0] < 128) {
                return buf;
            } else {
                return RLPEncoder.encodeLength(buf.length, 128, buf);
            }
        }
    }

    static encodeLength(len, offset, body) {
        if (len < 56) {
            return Buffer.concat([Buffer.from([offset + len]), body]);
        }
        const hexLength = len.toString(16);
        const lbuf = Buffer.from(hexLength.length % 2 ? '0' + hexLength : hexLength, 'hex');
        const firstByte = Buffer.from([offset + 55 + lbuf.length]);
        return Buffer.concat([firstByte, lbuf, body]);
    }

    static decode(buffer) {
        if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer);
        let decoded = [];
        let offset = 0;

        function parse(buf, pos) {
            if (pos >= buf.length) return null;
            const prefix = buf[pos];

            // 1. Single byte [0x00, 0x7f]
            if (prefix <= 0x7f) {
                return { data: buf.slice(pos, pos + 1), next: pos + 1 };
            }
            // 2. Short string (0-55 bytes) [0x80, 0xb7]
            if (prefix <= 0xb7) {
                const len = prefix - 0x80;
                return { data: buf.slice(pos + 1, pos + 1 + len), next: pos + 1 + len };
            }
            // 3. Long string (>55 bytes) [0xb8, 0xbf]
            if (prefix <= 0xbf) {
                const lenOfLen = prefix - 0xb7;
                const len = parseInt(buf.slice(pos + 1, pos + 1 + lenOfLen).toString('hex'), 16);
                const start = pos + 1 + lenOfLen;
                return { data: buf.slice(start, start + len), next: start + len };
            }
            // 4. Short list (0-55 bytes payload) [0xc0, 0xf7]
            if (prefix <= 0xf7) {
                const listLen = prefix - 0xc0;
                let innerPos = pos + 1;
                const end = innerPos + listLen;
                const items = [];
                while (innerPos < end) {
                    const res = parse(buf, innerPos);
                    items.push(res.data);
                    innerPos = res.next;
                }
                return { data: items, next: end };
            }
            // 5. Long list (>55 bytes payload) [0xf8, 0xff]
            const lenOfListLen = prefix - 0xf7;
            const listLen = parseInt(buf.slice(pos + 1, pos + 1 + lenOfListLen).toString('hex'), 16);
            let innerPos = pos + 1 + lenOfListLen;
            const end = innerPos + listLen;
            const items = [];
            while (innerPos < end) {
                const res = parse(buf, innerPos);
                items.push(res.data);
                innerPos = res.next;
            }
            return { data: items, next: end };
        }

        const result = parse(buffer, 0);
        return result ? result.data : null;
    }
}

// -------------------------------------------------------------
// EXECUTION & DEMONSTRATION
// -------------------------------------------------------------
console.log('='.repeat(78));
console.log(' PRACTICAL 6: RLP ENCODING OF ETHEREUM TRANSACTIONS & JSON COMPARISON');
console.log('='.repeat(78));

// 1. Exact Syllabus Code Snippet Demonstration
console.log('\n[1] SYLLABUS CODE SNIPPET (3-FIELD TX ARRAY):');
let RLP;
try {
    RLP = require("rlp");
} catch {
    RLP = RLPEncoder; // Zero-dependency fallback matching npm rlp interface
}

const tx = ["01", "5208", "3b9aca00"];
console.log('    Input Raw Fields : ', tx);
console.log('    • [0] Nonce       : 0x01 (Nonce 1)');
console.log('    • [1] Gas Limit   : 0x5208 (21,000 Standard Transfer Gas)');
console.log('    • [2] Gas Price   : 0x3b9aca00 (1,000,000,000 Wei = 1 Gwei)');

const encoded = RLP.encode(tx);
const encodedHex = encoded.toString("hex");

console.log(`    RLP Encoded (Hex): 0x${encodedHex}`);
console.log(`    RLP Byte Length  : ${encoded.length} bytes`);

// Decode back
const decoded = RLP.decode(encoded);
const decodedHexArray = decoded.map(buf => Buffer.isBuffer(buf) ? buf.toString('hex') : Buffer.from(buf).toString('hex'));
console.log('    Decoded Result   : ', decodedHexArray);
console.log(`    Verification     : ${JSON.stringify(tx) === JSON.stringify(decodedHexArray) ? '[✓] MATCH' : '[x] MISMATCH'}`);

// 2. Full Legacy Ethereum Transaction Structure
console.log('\n[2] COMPLETE 9-FIELD ETHEREUM TRANSACTION ENCODING:');
const fullTxFields = [
    "09",                                         // nonce (9)
    "04a817c800",                                 // gasPrice (20 Gwei)
    "5208",                                       // gasLimit (21000)
    "3535355577240ac0cb841adc77257acffd92237b", // to address
    "0de0b6b3a7640000",                           // value (1 ETH in Wei)
    "",                                           // data / payload (empty for transfer)
    "1c",                                         // v (recovery id)
    "28ef61340ecd95d5740ac10c759e0729fcd61663a86d32c9b520d24380f9e940", // r
    "67c6e4d030e5809769b0d2414758175255d045ea1383192728d815a1421014e1"  // s
];

const fullEncoded = RLPEncoder.encode(fullTxFields);
console.log(`    Full 9-field RLP Encoded (Hex):\n    0x${fullEncoded.toString('hex')}`);
console.log(`    Payload Size: ${fullEncoded.length} bytes`);

// 3. In-Depth Comparison: RLP vs JSON
console.log('\n[3] COMPARATIVE ANALYSIS: RLP vs JSON:');
const sampleTxObject = {
    nonce: "0x01",
    gasLimit: "0x5208",
    gasPrice: "0x3b9aca00"
};

const jsonString = JSON.stringify(sampleTxObject);
const jsonBuffer = Buffer.from(jsonString, 'utf8');

console.log(`
┌──────────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Feature / Metric     │ RLP (Recursive Length Prefix) │ JSON (JavaScript Object Not.) │
├──────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Format Type          │ Binary Serialization          │ Plaintext UTF-8 String        │
│ Encoded Byte Length  │ ${encoded.length} Bytes                      │ ${jsonBuffer.length} Bytes                     │
│ Overhead Efficiency  │ Extremely Compact (~${Math.round((1 - encoded.length / jsonBuffer.length) * 100)}% smaller)  │ High formatting overhead      │
│ Determinism          │ 100% Deterministic (Canonical)│ Non-deterministic (whitespace)│
│ Cryptographic Ready  │ Direct input to Keccak-256    │ Requires canonicalization     │
│ Human Readability    │ Requires Hex/RLP decoder      │ Directly human readable       │
│ Nested Arrays Support│ Native and recursive          │ Supported via syntax          │
└──────────────────────┴───────────────────────────────┴───────────────────────────────┘
`);

console.log('OUTPUT: RLP encoded and decoded Ethereum transaction is displayed.');
console.log('='.repeat(78) + '\n');
