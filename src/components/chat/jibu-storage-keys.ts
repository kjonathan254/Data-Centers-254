/**
 * Storage keys shared by the Jibu widget family (floating chat + welcome card).
 * One file so the literals never drift between components.
 */

/** sessionStorage — set when the visitor opens the chat panel (pulse dot consumed). */
export const JIBU_OPENED_KEY = "dc254:jibu-opened";

/** localStorage — timestamp of the last welcome dismissal/interaction; 7-day quiet period. */
export const JIBU_WELCOME_KEY = "dc254:jibu-welcome";

/** sessionStorage — set when the welcome card has been shown this session (hard once-per-session cap). */
export const JIBU_WELCOME_SESSION_KEY = "dc254:jibu-welcome-session";
