declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      SESSION_SECRET: string;
      HMAC_KEY: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: number;
      PROD: boolean;
    }
  }
}

export {}