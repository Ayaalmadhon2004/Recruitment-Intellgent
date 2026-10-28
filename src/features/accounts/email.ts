/** Same shape check as the design: something@something.something, no spaces. The provider verifies for real. */
const emailShape = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const normaliseEmail = (email: string): string => email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean => emailShape.test(email.trim());
