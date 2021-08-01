const config = {
  "port": +(process.env.PORT || "5000"),
  "sessionSecret": "change this secret in production",
  "hmacKey": "change this key in production",
  "dbUser": process.env.DB_USER || "postgres",
  "dbPassword": process.env.DB_PASSWORD || "postgres",
  "dbHost": process.env.DB_HOST || "localhost",
  "dbPort": +(process.env.DB_PORT || "5432"),
  "prod": !!process.env.PROD
};

export default config;