import type { DomainEvent } from '@saasflix/contracts';
import { logInfo } from '@saasflix/telemetry';

export function handleEvent(event: DomainEvent): void {
  logInfo('worker_event_received', { traceId: event.traceId, domain: event.eventType });
}
