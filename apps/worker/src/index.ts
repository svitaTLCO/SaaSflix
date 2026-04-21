import type { DomainEvent } from '@saasflix/contracts';
import { logInfo } from '@saasflix/telemetry';

export async function handleEvent(event: DomainEvent): Promise<void> {
  logInfo('worker_event_received', { traceId: event.traceId, domain: event.eventType });
}
