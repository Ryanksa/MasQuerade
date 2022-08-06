export interface User {
  username: string;
  name: string;
  socialStats: number;
}

export interface Member {
  username: string;
  name: string;
  socialStats: number;
  moderator: boolean;
}

export interface JWTData {
  id: string;
  username: string;
}
