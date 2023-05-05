import { ResponseData } from "../models/response";
import { get_, post_ } from "./fetch";

export const signUp = async (
  name: string,
  username: string,
  password: string
): Promise<ResponseData> => {
  const res = await post_("/api/user/signup", { name, username, password });
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const signIn = async (
  username: string,
  password: string
): Promise<ResponseData> => {
  const res = await post_("/api/user/signin", { username, password });
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};

export const signOut = async (): Promise<ResponseData> => {
  const res = await get_("/api/user/signout");
  const data: ResponseData = await res.json();
  if (res.status !== 200) {
    throw new Error(`${res.status}: ${data.message}`);
  }
  return data;
};
