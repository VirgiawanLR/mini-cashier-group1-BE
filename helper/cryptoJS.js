const CryptoJS = require("crypto-js");

module.exports = {
  encrypt: (textToEncrypt) => {
    const key = CryptoJS.enc.Utf8.parse("mySecretKey12345");
    const iv = CryptoJS.enc.Utf8.parse("mySecretIV67890");
    const ciphertext = CryptoJS.AES.encrypt(textToEncrypt, key, { iv: iv });
    const encryptedString = ciphertext.toString();
    return encryptedString;
  },

  decrypt: (encryptedString) => {
    const key = CryptoJS.enc.Utf8.parse("mySecretKey12345");
    const iv = CryptoJS.enc.Utf8.parse("mySecretIV67890");

    // decrypt the encrypted text
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedString);
    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: ciphertext,
      },
      key,
      {
        iv: iv,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  },
};
