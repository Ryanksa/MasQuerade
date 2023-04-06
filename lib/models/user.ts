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
  roomId: string;
};

export type JWTData = {
  id: string;
  username: string;
  name: string;
};
