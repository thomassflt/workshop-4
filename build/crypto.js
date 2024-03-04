"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.symDecrypt = exports.symEncrypt = exports.importSymKey = exports.exportSymKey = exports.createRandomSymmetricKey = exports.rsaDecrypt = exports.rsaEncrypt = exports.importPrvKey = exports.importPubKey = exports.exportPrvKey = exports.exportPubKey = exports.generateRsaKeyPair = void 0;
const crypto_1 = require("crypto");
// #############
// ### Utils ###
// #############
// Function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer) {
    return Buffer.from(buffer).toString("base64");
}
// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    var buff = Buffer.from(base64, "base64");
    return buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
}
async function generateRsaKeyPair() {
    // TODO implement this function using the crypto package to generate a public and private RSA key pair.
    //      the public key should be used for encryption and the private key for decryption. Make sure the
    //      keys are extractable.
    const KeyPair = await crypto_1.webcrypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, true, ["encrypt", "decrypt"]);
    // remove this
    return KeyPair;
}
exports.generateRsaKeyPair = generateRsaKeyPair;
// Export a crypto public key to a base64 string format
async function exportPubKey(key) {
    // TODO implement this function to return a base64 string version of a public key
    const exportedKey = await crypto_1.webcrypto.subtle.exportKey("spki", key);
    const exportedKeyStr = arrayBufferToBase64(exportedKey);
    // remove this
    return exportedKeyStr;
}
exports.exportPubKey = exportPubKey;
// Export a crypto private key to a base64 string format
async function exportPrvKey(key) {
    // TODO implement this function to return a base64 string version of a private key
    if (!key) {
        return "";
    }
    const exportedKey = await crypto_1.webcrypto.subtle.exportKey("pkcs8", key);
    const exportedKeyStr = arrayBufferToBase64(exportedKey);
    // remove this
    return exportedKeyStr;
}
exports.exportPrvKey = exportPrvKey;
// Import a base64 string public key to its native format
async function importPubKey(strKey) {
    // TODO implement this function to go back from the result of the exportPubKey function to it's native crypto key object
    //function:
    const importedKey = await crypto_1.webcrypto.subtle.importKey("spki", base64ToArrayBuffer(strKey), {
        name: "RSA-OAEP",
        hash: "SHA-256",
    }, true, ["encrypt"]);
    // remove this
    return importedKey;
}
exports.importPubKey = importPubKey;
// Import a base64 string private key to its native format
async function importPrvKey(strKey) {
    // TODO implement this function to go back from the result of the exportPrvKey function to it's native crypto key object
    //code:
    const importedKey = await crypto_1.webcrypto.subtle.importKey("pkcs8", base64ToArrayBuffer(strKey), {
        name: "RSA-OAEP",
        hash: "SHA-256",
    }, true, ["decrypt"]);
    // remove this
    return importedKey;
}
exports.importPrvKey = importPrvKey;
// Encrypt a message using an RSA public key
async function rsaEncrypt(b64Data, strPublicKey) {
    // TODO implement this function to encrypt a base64 encoded message with a public key
    // tip: use the provided base64ToArrayBuffer function
    const publicKey = await importPubKey(strPublicKey);
    const encryptedData = await crypto_1.webcrypto.subtle.encrypt({
        name: "RSA-OAEP",
    }, publicKey, base64ToArrayBuffer(b64Data));
    // remove this
    return arrayBufferToBase64(encryptedData);
}
exports.rsaEncrypt = rsaEncrypt;
// Decrypts a message using an RSA private key
async function rsaDecrypt(data, privateKey) {
    // TODO implement this function to decrypt a base64 encoded message with a private key
    // tip: use the provided base64ToArrayBuffer function
    const decryptedData = await crypto_1.webcrypto.subtle.decrypt({
        name: "RSA-OAEP",
    }, privateKey, base64ToArrayBuffer(data));
    // remove this
    return arrayBufferToBase64(decryptedData);
}
exports.rsaDecrypt = rsaDecrypt;
// ######################
// ### Symmetric keys ###
// ######################
// Generates a random symmetric key
async function createRandomSymmetricKey() {
    // TODO implement this function using the crypto package to generate a symmetric key.
    //      the key should be used for both encryption and decryption. Make sure the
    //      keys are extractable.
    const key = await crypto_1.webcrypto.subtle.generateKey({
        name: "AES-CBC",
        length: 256,
    }, true, ["encrypt", "decrypt"]);
    // remove this
    return key;
}
exports.createRandomSymmetricKey = createRandomSymmetricKey;
// Export a crypto symmetric key to a base64 string format
async function exportSymKey(key) {
    // TODO implement this function to return a base64 string version of a symmetric key
    const exportedKey = await crypto_1.webcrypto.subtle.exportKey("raw", key);
    const exportedKeyStr = arrayBufferToBase64(exportedKey);
    // remove this
    return exportedKeyStr;
}
exports.exportSymKey = exportSymKey;
// Import a base64 string format to its crypto native format
async function importSymKey(strKey) {
    // TODO implement this function to go back from the result of the exportSymKey function to it's native crypto key object
    const importedKey = await crypto_1.webcrypto.subtle.importKey("raw", base64ToArrayBuffer(strKey), {
        name: "AES-CBC",
    }, true, ["encrypt", "decrypt"]);
    // remove this
    return importedKey;
}
exports.importSymKey = importSymKey;
// Encrypt a message using a symmetric key
// Encrypt a message using a symmetric key
async function symEncrypt(key, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = new Uint8Array(16);
    const encrypted = await crypto_1.webcrypto.subtle.encrypt({
        name: "AES-CBC",
        iv: iv,
    }, key, encodedData);
    return arrayBufferToBase64(encrypted);
}
exports.symEncrypt = symEncrypt;
// Decrypt a message using a symmetric key
async function symDecrypt(strKey, encryptedDataWithIv) {
    const key = await importSymKey(strKey);
    const encryptedDataWithIvBuffer = base64ToArrayBuffer(encryptedDataWithIv);
    const iv = new Uint8Array(16);
    //const dataBuffer = encryptedDataWithIvBuffer.slice(12);
    const decrypted = await crypto_1.webcrypto.subtle.decrypt({
        name: "AES-CBC",
        iv: iv,
    }, key, encryptedDataWithIvBuffer);
    return new TextDecoder().decode(decrypted);
}
exports.symDecrypt = symDecrypt;
