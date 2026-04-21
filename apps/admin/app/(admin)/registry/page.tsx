import { assertSurfaceAccess } from '@saasflix/security';
import type { UserAccount } from '@saasflix/domain-identity';

const actor: UserAccount = {
  userId: '11111111-1111-1111-1111-111111111111',
  email: 'founder@saasflix.local',
  roles: ['founder'],
  plan: 'ultra',
  mfaEnabled: true
};

export default function RegistryAdminPage() {
  const allowed = assertSurfaceAccess(actor, 'admin');
  return <main>{allowed ? 'Admin surface: registry (M12 scaffold).' : 'Admin access denied.'}</main>;
}
