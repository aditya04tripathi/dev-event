import { encryptData, decryptData } from './encryption.util';

describe('Encryption Utilities', () => {
	describe('encryptData', () => {
		it('should encrypt data successfully', () => {
			const data = 'test data';
			const encrypted = encryptData(data);

			expect(encrypted).toBeDefined();
			expect(encrypted).not.toBe(data);
			expect(typeof encrypted).toBe('string');
		});

		it('should produce different encrypted values for same input', () => {
			const data = 'test data';
			const encrypted1 = encryptData(data);
			const encrypted2 = encryptData(data);

			expect(encrypted1).not.toBe(encrypted2);
		});

		it('should handle empty string', () => {
			const encrypted = encryptData('');
			expect(encrypted).toBeDefined();
		});

		it('should handle special characters', () => {
			const data = '{"key": "value", "special": "!@#$%^&*()"}';
			const encrypted = encryptData(data);
			expect(encrypted).toBeDefined();
		});
	});

	describe('decryptData', () => {
		it('should decrypt data successfully', () => {
			const originalData = 'test data';
			const encrypted = encryptData(originalData);
			const decrypted = decryptData(encrypted);

			expect(decrypted).toBe(originalData);
		});

		it('should handle JSON data', () => {
			const originalData = JSON.stringify({
				key: 'value',
				number: 123,
				nested: { data: 'test' },
			});
			const encrypted = encryptData(originalData);
			const decrypted = decryptData(encrypted);

			expect(decrypted).toBe(originalData);
			expect(JSON.parse(decrypted)).toEqual(JSON.parse(originalData));
		});

		it('should throw error for invalid encrypted data', () => {
			expect(() => decryptData('invalid-encrypted-data')).toThrow();
		});

		it('should throw error for tampered data', () => {
			const encrypted = encryptData('test data');
			const tampered = encrypted.slice(0, -5) + 'xxxxx';

			expect(() => decryptData(tampered)).toThrow();
		});
	});

	describe('encrypt-decrypt roundtrip', () => {
		it('should handle multiple roundtrips', () => {
			const data = 'test data';

			const encrypted1 = encryptData(data);
			const decrypted1 = decryptData(encrypted1);
			expect(decrypted1).toBe(data);

			const encrypted2 = encryptData(decrypted1);
			const decrypted2 = decryptData(encrypted2);
			expect(decrypted2).toBe(data);
		});

		it('should handle large data', () => {
			const largeData = 'x'.repeat(10000);
			const encrypted = encryptData(largeData);
			const decrypted = decryptData(encrypted);

			expect(decrypted).toBe(largeData);
		});

		it('should handle unicode characters', () => {
			const unicodeData = '你好世界 🌍 مرحبا العالم';
			const encrypted = encryptData(unicodeData);
			const decrypted = decryptData(encrypted);

			expect(decrypted).toBe(unicodeData);
		});
	});
});
