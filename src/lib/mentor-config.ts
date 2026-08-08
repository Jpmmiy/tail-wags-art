export const MENTOR_EXPIRATION_DATE = new Date('2030-01-01T00:00:00Z'); // Mentor Vitalício ativado até 2030

export function isMentorEnabled() {
  return new Date() < MENTOR_EXPIRATION_DATE;
}
