import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const [input, passwordFile, output] = process.argv.slice(2);
if (!input || !passwordFile || !output) {
  throw new Error('Usage: node scripts/seal-reading.mjs INPUT_HTML PASSPHRASE_FILE OUTPUT');
}

const password = readFileSync(passwordFile, 'utf8').trim();
if (!/^[0-9a-f]{64}$/.test(password)) {
  throw new Error('Expected a 32-byte random passphrase encoded as lowercase hexadecimal.');
}

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, 600_000, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const contents = Buffer.concat([cipher.update(readFileSync(input)), cipher.final(), cipher.getAuthTag()]);
writeFileSync(output, Buffer.concat([salt, iv, contents]));
