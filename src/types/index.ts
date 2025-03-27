export interface Query {
  id: number;
  query: string;
  data: Record<string, any>[];
}

export interface RateLimiterResult {
  canMakeRequest: () => boolean;
  addRequestTimestamp: () => void;
  rateLimitMessage: string | null;
}

export interface ThemeContextType {
  mode: "light" | "dark";
  toggleTheme: () => void;
}
