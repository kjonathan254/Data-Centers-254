/**
 * Storage keys shared by the Jibu widget family (floating chat + welcome card).
 * One file so the literals never drift between components.
 */

/** sessionStorage — set when the visitor opens the chat panel (pulse dot consumed). */
export const JIBU_OPENED_KEY = "dc254:jibu-opened";

/**
 * localStorage — timestamp of the last welcome dismissal/interaction; 48h quiet
 * period. v2 (2026-09-05): the v1 key carried a 7-day silence that made the
 * intro look broken to anyone who had dismissed it once; the new literal
 * re-introduces Jibu to every existing visitor exactly once.
 */
export const JIBU_WELCOME_KEY = "dc254:jibu-welcome:v2";

/** sessionStorage — set when the welcome card has been shown this session (hard once-per-session cap). */
export const JIBU_WELCOME_SESSION_KEY = "dc254:jibu-welcome-session:v2";
