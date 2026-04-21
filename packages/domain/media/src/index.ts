export type MediaKind = 'image' | 'video' | 'document';

export interface MediaAsset {
  readonly assetId: string;
  readonly ownerUserId: string;
  readonly kind: MediaKind;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storageKey: string;
  readonly createdAt: string;
}

const maxSizeByKind: Record<MediaKind, number> = {
  image: 10 * 1024 * 1024,
  video: 250 * 1024 * 1024,
  document: 20 * 1024 * 1024
};

export function validateMediaAsset(asset: MediaAsset): { readonly isValid: boolean; readonly reasons: readonly string[] } {
  const reasons: string[] = [];
  if (Number.isNaN(Date.parse(asset.createdAt))) reasons.push('invalid_created_at');
  if (asset.sizeBytes <= 0 || asset.sizeBytes > maxSizeByKind[asset.kind]) reasons.push('invalid_size');
  if (!asset.storageKey.startsWith('uploads/')) reasons.push('invalid_storage_key');
  if (!asset.mimeType.includes('/')) reasons.push('invalid_mime');
  return { isValid: reasons.length === 0, reasons };
}
