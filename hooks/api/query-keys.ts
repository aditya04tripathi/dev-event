export const queryKeys = {
  events: {
    all: ["events"] as const,
    list: (params: any) => ["events", "list", params] as const,
    detail: (idOrSlug: string) => ["events", "detail", idOrSlug] as const,
    mine: (params: any) => ["events", "mine", params] as const,
  },
  participants: {
    list: (eventId: string, params: any) =>
      ["participants", eventId, params] as const,
  },
  users: {
    detail: (id: string) => ["users", "detail", id] as const,
  },
};
