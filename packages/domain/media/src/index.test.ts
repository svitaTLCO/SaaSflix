import { describe, expect, it } from 'vitest';
import { validateMediaAsset, type MediaAsset } from './index';

const asset: MediaAsset = {
  assetId: 'a1',
  ownerUserId: 'u1',
  kind: 'image',
  fileName: 'hero.png',
  mimeType: 'image/png',
  sizeBytes: 1024,
  storageKey: 'uploads/u1/hero.png',
  createdAt: '2026-04-21T00:00:00.000Z'
};

describe('media domain', () => {
  it('validates acceptable media assets', () => {
    expect(validateMediaAsset(asset).isValid).toBe(true);
  });

  it('rejects invalid storage key and size', () => {
    const result = validateMediaAsset({ ...asset, storageKey: 'bad', sizeBytes: 999999999 });
    expect(result.isValid).toBe(false);
    expect(result.reasons).toContain('invalid_storage_key');
  });
});
