export interface LogContext {
  readonly traceId?: string;
  readonly domain?: string;
}

export function logInfo(message: string, context: LogContext = {}): void {
  console.info(JSON.stringify({ level: 'info', message, ...context }));
}
