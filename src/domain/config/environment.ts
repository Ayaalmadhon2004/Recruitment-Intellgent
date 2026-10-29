/**
 * True only in `next dev`. Development-only notices (the dev account and unlock services) read this so they
 * never reach real users. Next replaces `process.env.NODE_ENV` at build time, so it is safe on the client.
 */
export const isDevelopmentBuild: boolean = process.env.NODE_ENV === 'development';
