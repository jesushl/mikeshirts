import api from '../api/client'

export async function trackEvent(
  eventType: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await api.post('/analytics/event/', { event_type: eventType, metadata })
  } catch {
    // Analytics should never block UI
  }
}
