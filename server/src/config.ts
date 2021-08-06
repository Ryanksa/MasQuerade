const config = {
  "port": process.env.PORT,
  "sessionSecret": process.env.SESSION_SECRET,
  "hmacKey": process.env.HMAC_KEY,
  "dbUser": process.env.DB_USER,
  "dbPassword": process.env.DB_PASSWORD,
  "dbHost": process.env.DB_HOST,
  "dbPort": process.env.DB_PORT,
  "prod": process.env.NODE_ENV === "production"
};

export default config;