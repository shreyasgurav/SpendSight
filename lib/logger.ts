const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info("[SpendSight]", ...args);
    }
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn("[SpendSight:WARN]", ...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error("[SpendSight:ERROR]", ...args);
  },
};
