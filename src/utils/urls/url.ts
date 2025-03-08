import axios from "axios";

let environment = 1;

export let Url =
  environment == 1
    ? "http://10.0.0.238:3011/api"
    : "http://172.20.10.10:3011/api";

export const AuthUrl = `${Url}/auth/v1`;

export const instance = axios.create({
  baseURL: AuthUrl
})