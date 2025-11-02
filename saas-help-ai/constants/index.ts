export const FREE_SEARCHES_LIMIT = 5;

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: "Free",
    searchesPerMonth: 5,
    price: 0,
    features: [
      "5 AI validations",
      "Basic project plans",
      "Flowchart visualization",
    ],
  },
  MONTHLY: {
    name: "Monthly",
    searchesPerMonth: 50,
    price: 29,
    interval: "monthly",
    features: [
      "50 AI validations/month",
      "Advanced project plans",
      "KANBAN & SCRUM boards",
      "Priority support",
    ],
  },
  YEARLY: {
    name: "Yearly",
    searchesPerMonth: 600,
    price: 299,
    interval: "yearly",
    features: [
      "600 AI validations/year",
      "Advanced project plans",
      "KANBAN & SCRUM boards",
      "Priority support",
      "20% savings",
    ],
  },
  ONE_OFF: {
    name: "One-Time",
    searchesPerMonth: Infinity,
    price: 49,
    interval: "one-time",
    features: [
      "Unlimited validations (lifetime)",
      "Advanced project plans",
      "KANBAN & SCRUM boards",
      "Priority support",
    ],
  },
} as const;

export const RATE_LIMIT = {
  VALIDATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
} as const;

export const CACHE_TTL = {
  VALIDATION: 60 * 60, // 1 hour
  USER: 5 * 60, // 5 minutes
  PROJECT: 30 * 60, // 30 minutes
} as const;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: "15m",
  REFRESH_TOKEN_EXPIRY: "7d",
} as const;
