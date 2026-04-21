import { assertSurfaceAccess } from '@saasflix/security';
import type { UserAccount } from '@saasflix/domain-identity';

const actor: UserAccount = {
  userId: '11111111-1111-1111-1111-111111111111',
  email: 'founder@saasflix.local',
  roles: ['founder'],
  plan: 'ultra',
  mfaEnabled: true
};

export default function FlagsAdminPage() {
  const allowed = assertSurfaceAccess(actor, 'admin');
  return <main>{allowed ? 'Admin surface: flags (M12 scaffold).' : 'Admin access denied.'}</main>;
}
