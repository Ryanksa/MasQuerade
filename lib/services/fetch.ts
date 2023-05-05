const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";
const HEADERS = {
  "Content-Type": "application/json",
};

export const get_ = (url: string) => {
  return fetch(url, { method: GET });
};

export const post_ = (url: string, body?: Object) => {
  return fetch(url, {
    method: POST,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : "",
  });
};

export const put_ = (url: string, body?: Object) => {
  return fetch(url, {
    method: PUT,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : "",
  });
};

export const delete_ = (url: string, body?: Object) => {
  return fetch(url, {
    method: DELETE,
    headers: HEADERS,
    body: body ? JSON.stringify(body) : "",
  });
};
