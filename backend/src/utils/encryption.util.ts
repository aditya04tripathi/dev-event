import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

const SECRET_KEY =
	process.env.JWT_SECRET || 'fallback-secret-key-32-bytes-long!';
const key = crypto
	.createHash('sha256')
	.update(String(SECRET_KEY))
	.digest('base64')
	.substring(0, 32);

export function encryptData(text: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(text: string): string {
	const textParts = text.split(':');
	const ivHex = textParts.shift();
	if (!ivHex) throw new Error('Invalid encrypted text format');
	const iv = Buffer.from(ivHex, 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}
