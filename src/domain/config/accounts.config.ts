/**
 * Sign-in behaviour that is a UI choice, not a fact about a provider.
 * PLACEHOLDER: the 30 second wait before "Resend link" comes from the design. A real provider may enforce
 * its own limit.
 */
export const accountsConfig = {
  resendCooldownSeconds: 30,
  status: 'placeholder',
} as const;
