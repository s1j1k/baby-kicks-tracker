export interface Kick {
    date: Date; // just holds the time
    strength?: number; // TODO make it a percent
    multiple?: number; // TODO make it a percent
    tags?: string[]; // TODO make tags linked to the user account
    // position: number; // in percentage of 24 hours, with a precision of 1 hour
  }