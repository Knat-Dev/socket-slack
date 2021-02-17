import Axios, { AxiosInstance } from 'axios';
import { setAccessToken } from '..';

const axios: AxiosInstance = Axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    Authorization: sessionStorage.getItem('cc_token')
      ? 'Bearer ' + sessionStorage.getItem('cc_token')
      : null,
  },
});

// Automatic refresh jwt when needed
axios.interceptors.response.use(
  (response) => response,
  (err) => {
    return new Promise(async (resolve, reject) => {
      const originalRequest = err.config;
      console.log(originalRequest);
      if (err?.response?.status === 401 && !err.config?.__isRetryRequest) {
        originalRequest._retry = true;
        // unauthorized
        console.log('Trying refresh..');
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/users/refresh`,
          {
            credentials: 'include',
            method: 'POST',
          }
        )
          .then(async (res) => {
            const data = await res.json();
            const { accessToken } = data;
            setAccessToken(accessToken);

            originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
            return axios(originalRequest);
          })
          .catch((e) => {
            console.log(e);
          });
        return resolve(res);
      }

      return reject(err);
    });
  }
);

export default axios;
