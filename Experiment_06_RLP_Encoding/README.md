# PRACTICAL 6: RLP Encoding of Ethereum Transactions

## Aim
Write a Simple Program to Understand RLP Encoding of Ethereum Transactions.

---

## Objectives
- To understand Recursive Length Prefix (RLP) encoding mechanics used in Ethereum.
- To encode and decode an Ethereum transaction array and verify round-trip integrity.
- To compare the architectural differences, byte efficiency, and determinism between RLP and JSON.

---

## Facilities
- Computer System
- Node.js Runtime (v18+)
- Web Browser

---

## Theory

### 1. What is Recursive Length Prefix (RLP)?
Recursive Length Prefix (RLP) is Ethereum's primary serialization algorithm used to encode arbitrarily nested arrays of binary data (byte arrays and lists of byte arrays). Unlike JSON, Protobuf, or BSON, RLP encodes **only structure**; it leaves the interpretation of data types (integers, strings, floating-point numbers) entirely to higher-level protocol rules.

### 2. RLP Encoding Rules (Ethereum Yellow Paper)
1. **Single Byte ($[0x00, 0x7f]$)**: If the value is a single byte $\le 127$, the byte itself is its own RLP encoding.
2. **Short String ($0 - 55$ bytes)**: If a string is $0-55$ bytes long, the encoding is $(0x80 + \text{length})$ followed by the string bytes.
   - Example: An empty string `""` has length 0 $\rightarrow 0x80 + 0 = 0x80$.
3. **Long String ($> 55$ bytes)**: If a string exceeds 55 bytes, the encoding is $(0xb7 + \text{length of length})$ followed by the length in bytes, followed by the payload.
4. **Short List ($0 - 55$ bytes total payload)**: If a list's serialized items total $0-55$ bytes, the prefix is $(0xc0 + \text{length})$ followed by the concatenation of all encoded items.
5. **Long List ($> 55$ bytes total payload)**: The prefix is $(0xf7 + \text{length of length})$, followed by the list length, followed by the concatenated items.

---

## Comparative Analysis: RLP vs JSON

| Parameter | RLP (Recursive Length Prefix) | JSON (JavaScript Object Notation) |
| :--- | :--- | :--- |
| **Data Format** | Binary serialization | Textual UTF-8 string |
| **Payload Size** | Minimal byte overhead (~80% smaller) | Verbose key-value strings, quotes, braces |
| **Determinism** | **100% Deterministic (Canonical)** | Non-deterministic (whitespace & key order variations) |
| **Hashing Readiness**| Direct input to `keccak256(RLP)` for Tx Hashes | Requires complex canonicalization |
| **Type System** | Untyped (bytes and lists only) | Typed (string, number, boolean, array, object) |
| **Human Readability**| Low (hexadecimal byte stream) | High (plain English keys & values) |

---

## Procedure
1. Create a sample transaction list containing `nonce`, `gasLimit`, and `gasPrice` (e.g., `["01", "5208", "3b9aca00"]`).
2. Implement the RLP encoder to process nested items and compute prefix bytes according to length rules.
3. Serialize the transaction fields to an RLP byte buffer.
4. Convert the buffer to hexadecimal format and inspect the byte decomposition.
5. Implement the inverse decoder to reconstruct the original transaction array.
6. Compare the byte length of the RLP output with its JSON equivalent.

---

## Code Snippet
```javascript
const RLP = require("rlp");
const tx = ["01", "5208", "3b9aca00"];
const encoded = RLP.encode(tx);
console.log(encoded.toString("hex"));

// Output: c901825208843b9aca00
```

---

## How to Run
### Option A: CLI Terminal Execution
```bash
node Experiment_06_RLP_Encoding/rlp_demo.js
```

### Option B: Interactive Web Visualizer
Open `Experiment_06_RLP_Encoding/index.html` in your browser or run:
```bash
npm start
# Navigate to http://localhost:3000/Experiment_06_RLP_Encoding/
```

---

## Output
```
==============================================================================
 PRACTICAL 6: RLP ENCODING OF ETHEREUM TRANSACTIONS & JSON COMPARISON
==============================================================================

[1] SYLLABUS CODE SNIPPET (3-FIELD TX ARRAY):
    Input Raw Fields :  [ '01', '5208', '3b9aca00' ]
    • [0] Nonce       : 0x01 (Nonce 1)
    • [1] Gas Limit   : 0x5208 (21,000 Standard Transfer Gas)
    • [2] Gas Price   : 0x3b9aca00 (1,000,000,000 Wei = 1 Gwei)
    RLP Encoded (Hex): 0xc901825208843b9aca00
    RLP Byte Length  : 10 bytes
    Decoded Result   :  [ '01', '5208', '3b9aca00' ]
    Verification     : [✓] MATCH

[2] COMPLETE 9-FIELD ETHEREUM TRANSACTION ENCODING:
    Full 9-field RLP Encoded (Hex):
    0xf86c098504a817c800825208943535355577240ac0cb841adc77257acffd92237b880de0b6b3a7640000801ca028ef61340ecd95d5740ac10c759e0729fcd61663a86d32c9b520d24380f9e940a067c6e4d030e5809769b0d2414758175255d045ea1383192728d815a1421014e1
    Payload Size: 110 bytes

[3] COMPARATIVE ANALYSIS: RLP vs JSON:
┌──────────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Feature / Metric     │ RLP (Recursive Length Prefix) │ JSON (JavaScript Object Not.) │
├──────────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Format Type          │ Binary Serialization          │ Plaintext UTF-8 String        │
│ Encoded Byte Length  │ 10 Bytes                      │ 60 Bytes                     │
│ Overhead Efficiency  │ Extremely Compact (~83% smaller)  │ High formatting overhead      │
│ Determinism          │ 100% Deterministic (Canonical)│ Non-deterministic (whitespace)│
│ Cryptographic Ready  │ Direct input to Keccak-256    │ Requires canonicalization     │
│ Human Readability    │ Requires Hex/RLP decoder      │ Directly human readable       │
│ Nested Arrays Support│ Native and recursive          │ Supported via syntax          │
└──────────────────────┴───────────────────────────────┴───────────────────────────────┘

OUTPUT: RLP encoded and decoded Ethereum transaction is displayed.
==============================================================================
```

---

## Conclusion
RLP encoding and decoding of an Ethereum transaction was successfully implemented and demonstrated. The transaction fields were correctly encoded into a canonical 10-byte hex stream and recovered back to their exact original values without loss of precision. Comparative benchmarking confirmed that RLP achieves over 80% space savings compared to JSON while guaranteeing 100% cryptographic determinism.
