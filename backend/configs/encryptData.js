const crypto = require('crypto');

const DB_SECRET_KEY = process.env.DB_SECRET_KEY
const DB_SECRET_IV_HEX = process.env.DB_SECRET_IV_HEX

function encrypt(text) {
    const iv = Buffer.from(DB_SECRET_IV_HEX, 'hex');
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(DB_SECRET_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
} 

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedTextBuffer = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(DB_SECRET_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

module.exports = {
    encrypt,
    decrypt
}