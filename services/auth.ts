export const signUp = (name: string, username: string, password: string) => {
  return fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      username,
      password,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return err;
    });
};

export const signIn = (username: string, password: string) => {
  return fetch("/api/user/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return err;
    });
};

export const signOut = () => {
  return fetch("/api/user/signin")
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return err;
    });
};
