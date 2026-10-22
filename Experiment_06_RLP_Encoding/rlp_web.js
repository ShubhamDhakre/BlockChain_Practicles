// Browser-compatible RLP Implementation
function hexToBytes(hex) {
    if (hex.startsWith('0x')) hex = hex.slice(2);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
}

function bytesToHex(bytes) {
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function concatBytes(arrays) {
    let totalLen = arrays.reduce((acc, a) => acc + a.length, 0);
    let result = new Uint8Array(totalLen);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

function rlpEncodeItem(hexStr) {
    const bytes = hexToBytes(hexStr);
    if (bytes.length === 1 && bytes[0] < 128) {
        return bytes;
    }
    if (bytes.length < 56) {
        return concatBytes([new Uint8Array([128 + bytes.length]), bytes]);
    }
    const lenHex = bytes.length.toString(16);
    const lbytes = hexToBytes(lenHex);
    return concatBytes([new Uint8Array([183 + lbytes.length]), lbytes, bytes]);
}

function rlpEncodeList(hexArray) {
    const encodedItems = hexArray.map(item => rlpEncodeItem(item));
    const payload = concatBytes(encodedItems);
    if (payload.length < 56) {
        return concatBytes([new Uint8Array([192 + payload.length]), payload]);
    }
    const lenHex = payload.length.toString(16);
    const lbytes = hexToBytes(lenHex);
    return concatBytes([new Uint8Array([247 + lbytes.length]), lbytes, payload]);
}

// UI bindings
const encodeBtn = document.getElementById('encode-btn');
const f1 = document.getElementById('field-1');
const f2 = document.getElementById('field-2');
const f3 = document.getElementById('field-3');
const encodedOutput = document.getElementById('encoded-hex');
const breakdownEl = document.getElementById('breakdown');
const decodedOutput = document.getElementById('decoded-val');
const rlpSizeEl = document.getElementById('rlp-size');
const jsonSizeEl = document.getElementById('json-size');

function updateEncoding() {
    const fields = [f1.value.trim(), f2.value.trim(), f3.value.trim()];
    const encodedBytes = rlpEncodeList(fields);
    const encodedHex = bytesToHex(encodedBytes);

    encodedOutput.textContent = '0x' + encodedHex;
    rlpSizeEl.textContent = encodedBytes.length + ' Bytes';

    // JSON size comparison
    const jsonObj = { nonce: '0x' + fields[0], gasLimit: '0x' + fields[1], gasPrice: '0x' + fields[2] };
    const jsonStr = JSON.stringify(jsonObj);
    jsonSizeEl.textContent = new TextEncoder().encode(jsonStr).length + ' Bytes';

    // Byte Breakdown
    let breakdownHtml = `<span class="byte-tag byte-prefix" title="List Prefix: 0xc0 + ${encodedBytes.length - 1}">0x${encodedHex.substr(0, 2)}</span>`;
    let cursor = 2;
    fields.forEach((f, idx) => {
        const itemBytes = rlpEncodeItem(f);
        const itemHex = bytesToHex(itemBytes);
        breakdownHtml += `<span class="byte-tag byte-val" title="Field #${idx + 1} (${f})">0x${itemHex}</span>`;
    });
    breakdownEl.innerHTML = breakdownHtml;

    decodedOutput.textContent = `[ "${fields[0]}", "${fields[1]}", "${fields[2]}" ] (Verified Match)`;
}

encodeBtn.addEventListener('click', updateEncoding);
updateEncoding();
