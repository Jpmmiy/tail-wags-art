export const MENTOR_EXPIRATION_DATE = new Date('2030-01-01T00:00:00Z'); // Extendida conforme solicitação do usuário

export function isMentorEnabled() {
  return new Date() < MENTOR_EXPIRATION_DATE;
}
