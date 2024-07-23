import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const relayService = ({ url, method = "GET", headers, data }) => {
  console.log(url, method, headers, data);
  const axios_instance = axios({
    url,
    method,
    baseURL: BASE_URL,
    headers,
    data,
  });
  return axios_instance;
};

export default relayService;
