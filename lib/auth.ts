import type { NextApiRequest } from "next";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { JWTData } from "../models/user";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const jwtSecret: jwt.Secret = process.env.JWT_SECRET ?? "";

export function isAuthenticated(req: NextApiRequest): boolean {
  if (!req.headers.cookie) {
    return false;
  }

  const cookies = cookie.parse(req.headers.cookie);
  if (!cookies.token) {
    return false;
  }

  const decoded = jwt.verify(cookies.token, jwtSecret) as JWTData;
  if (!decoded) {
    return false;
  }

  req.cookies = {
    id: decoded.id,
    username: decoded.username,
  };
  return true;
}

export function getServerSidePropsAuth(
  context: GetServerSidePropsContext,
  redirect: { ifAuth: boolean; ifUnauth: boolean; url: string },
  getServerSideProps?: GetServerSideProps
) {
  let isAuthenticated = false;
  const cookies = context.req.cookies;
  if (cookies.token) {
    const decoded = jwt.verify(cookies.token, jwtSecret) as JWTData;
    if (decoded) isAuthenticated = true;
  }

  if (
    (redirect.ifUnauth && !isAuthenticated) ||
    (redirect.ifAuth && isAuthenticated)
  ) {
    return {
      redirect: {
        permanent: false,
        destination: redirect.url,
      },
      props: {},
    };
  }

  if (getServerSideProps) {
    return getServerSideProps(context);
  }
  return { props: {} };
}
