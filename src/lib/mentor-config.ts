export const MENTOR_EXPIRATION_DATE = new Date('2026-08-21T00:00:00Z'); // 15 dias a partir de hoje (06/08/2026)

export function isMentorEnabled() {
  return new Date() < MENTOR_EXPIRATION_DATE;
}
