const crypto = require("crypto");

module.exports = {
    /**
     * Encrypts data
     * @param {object} options
     * @param {string} options.algorithm algorithm to use. any output of `openssl list -cipher-algorithms`
     * is a possible value. e.g. `aes-128-cbc`
     * @param {string} options.key key to use to encrypt this message, in `base64`
     * @param {string} options.iv initialization vector, in `base64`
     * @param {string|Buffer} options.data data to encrypt. usually a string. 
     * @param {string} [options.encoding] input data encoding. defaults to `"utf8"`
     * @returns {string} ciphertext in `base64`
     */
    encrypt({ algorithm, key, iv, data, encoding }) {

        if (algorithm === "rsa") {
            return this.encryptRsa(data, key);
        }

        encoding = encoding || "utf8";
        const keyBuffer = Buffer.from(key, "base64");
        const ivBuffer = Buffer.from(iv, "base64");
        const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);

        let cipherText = cipher.update(data, "utf8", "base64");
        cipherText += cipher.final("base64");
        return cipherText;
    },

    /**
     * Descrypts data
     * @param {object} options
     * @param {string} options.algorithm algorithm to use. any output of `openssl list -cipher-algorithms`
     * is a possible value. e.g. `aes-128-cbc`
     * @param {string} options.key key to use to encrypt this message, in `base64`
     * @param {string} options.iv initialization vector, in `base64`
     * @param {string|Buffer} options.data data to decrypt. usually a string.
     * @param {string} [options.encoding] input data encoding. defaults to `"base64"`.
     * @returns {string} plaintext in `utf8`
     */
    decrypt({ algorithm, key, iv, data }) {
        if (algorithm === "rsa") {
            return this.decryptRsa(data, key);
        }

        const keyBuffer = Buffer.from(key, "base64");
        const ivBuffer = Buffer.from(iv, "base64");
        const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
        let result = decipher.update(data, "base64", "utf8");
        result += decipher.final("utf8");
        return result;
    },

    /**
     * Encrypts data with rsa public key
     * @param {string} toEncrypt something to encrypt
     * @param {Buffer} publicKey public key
     */
    encryptRsa(toEncrypt, publicKey) {
        const buffer = Buffer.from(toEncrypt);
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        return encrypted.toString("base64");
    },

    /**
     * Decrypt data with rsa public key
     * @param {string} toDecrypt 
     * @param {Buffer} privateKey private key
     */
    decryptRsa(toDecrypt, privateKey) {
        const buffer = Buffer.from(toDecrypt, "base64");
        const decrypted = crypto.privateDecrypt(privateKey, buffer);
        return decrypted.toString("utf8");
    }
}