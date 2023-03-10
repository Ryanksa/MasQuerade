export type User = {
  username: string;
  name: string;
  socialStats: number;
};

export type Member = {
  username: string;
  name: string;
  socialStats: number;
  moderator: boolean;
};

export type JWTData = {
  id: string;
  username: string;
};
