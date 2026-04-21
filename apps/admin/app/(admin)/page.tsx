import { assertSurfaceAccess } from '@saasflix/security';
import type { UserAccount } from '@saasflix/domain-identity';

const exampleActor: UserAccount = {
  userId: '11111111-1111-1111-1111-111111111111',
  email: 'founder@saasflix.local',
  roles: ['founder'],
  plan: 'ultra',
  mfaEnabled: true
};

export default function AdminHomePage(): JSX.Element {
  const allowed = assertSurfaceAccess(exampleActor, 'admin');

  return <main>{allowed ? 'Admin operations surface (M1 authz scaffold).' : 'Admin access denied.'}</main>;
}
