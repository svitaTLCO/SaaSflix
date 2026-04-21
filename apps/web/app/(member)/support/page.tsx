import { assertSurfaceAccess } from '@saasflix/security';
import type { UserAccount } from '@saasflix/domain-identity';

const actor: UserAccount = {
  userId: '22222222-2222-2222-2222-222222222222',
  email: 'member@saasflix.local',
  roles: ['member'],
  plan: 'pro',
  mfaEnabled: true
};

export default function SupportPage() {
  const allowed = assertSurfaceAccess(actor, 'member');
  return <main>{allowed ? 'Member surface: support (M12 scaffold).' : 'Sign-in required.'}</main>;
}
