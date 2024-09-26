import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  api_base_url: process.env.API_BASE_URL,
  client_base_url: process.env.CLIENT_BASE_URL,
  aamarpay_gateway_base_url: process.env.AAMARPAY_GATEWAY_BASE_URL,
  aamarpay_store_id: process.env.AAMARPAY_STORE_ID,
  aamarpay_signature_key: process.env.AAMARPAY_SIGNATURE_KEY,
};
