import axios from "axios";
import { ResponseData } from "../models/response";

export const signUp = (
  name: string,
  username: string,
  password: string
): Promise<ResponseData> => {
  return axios
    .post("/api/user/signup", { name, username, password })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data as ResponseData;
    });
};

export const signIn = (
  username: string,
  password: string
): Promise<ResponseData> => {
  return axios.post("/api/user/signin", { username, password }).then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ResponseData;
  });
};

export const signOut = (): Promise<ResponseData> => {
  return axios.get("/api/user/signout").then((res) => {
    if (res.status !== 200) {
      throw new Error(`${res.status}: ${res.data.message}`);
    }
    return res.data as ResponseData;
  });
};
