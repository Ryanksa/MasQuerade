import axios from "axios";

export const signUp = (name: string, username: string, password: string) => {
  return axios
    .post("/api/user/signup", { name, username, password })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const signIn = (username: string, password: string) => {
  return axios
    .post("/api/user/signin", { username, password })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const signOut = () => {
  return axios
    .get("/api/user/signout")
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`${res.status}: ${res.data.message}`);
      }
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
