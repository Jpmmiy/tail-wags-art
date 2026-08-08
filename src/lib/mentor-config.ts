export const MENTOR_EXPIRATION_DATE = new Date('2026-08-23T00:00:00Z'); // Ativa por 15 dias (até 23/08/2026)

export function isMentorEnabled() {
  return new Date() < MENTOR_EXPIRATION_DATE;
}
