import * as CryptoJS from "crypto-js";

export class AESHelper {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.SECRET_KEY as string;
  }

  encrypt(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(text, this.secretKey);
    return encrypted.toString();
  }

  decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
