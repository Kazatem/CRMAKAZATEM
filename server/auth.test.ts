import { describe, expect, it } from 'vitest';
import { comparePasswords, hashPassword } from './auth';

describe('auth helpers', () => {
  it('creates and verifies a hashed password', async () => {
    const rawPassword = 'TestPassword123!';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    expect(await comparePasswords(rawPassword, hashed)).toBe(true);
  });

  it('fails verification for incorrect password', async () => {
    const rawPassword = 'CorrectPassword';
    const hashed = await hashPassword(rawPassword);

    expect(await comparePasswords('WrongPassword', hashed)).toBe(false);
  });
});
