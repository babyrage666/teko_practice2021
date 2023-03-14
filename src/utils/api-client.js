import axios from 'axios';
import { stringify } from 'qs';

axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;
axios.defaults.paramsSerializer = params => stringify(params, { arrayFormat: 'comma' });

axios.interceptors.request.use((config) => {
  ApiClient.onRequest();
  const authData = JSON.parse(localStorage.getItem('authData')); 
  if (authData && authData.expires >= Date.now()) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    ApiClient.onResponse();;
    if (typeof response.data.success === 'undefined') {
      return response.data;
    }

    if (!response.data.success) {
      if (response.data.error?.code === 401) {
        ApiClient.onUnauthorized();
      }

      if (response.data.error?.code === 500) {
        ApiClient.onError(response.data.error);
      }

      return Promise.reject(response.data.error);
    }

    return response.data.result;
  },
  (error) => {
    ApiClient.onResponse();

    if (typeof error.code !== 'undefined') {
      // api error
    } else {
      // http error
      // eslint-disable-next-line no-lonely-if
      if (error.response?.status === 401) {
        ApiClient.onUnauthorized();
      } else {
        ApiClient.onError(error);
      }
    }

    return Promise.reject(error);
  },
);

export const ApiClient = {
  onUnauthorized: () => {},
  onError: () => {},
  onRequest: () => {},
  onResponse: () => {},

  auth: {
    /**
     * @param {Object} data
     * @param {string} data.login
     * @param {string} data.password
     * @returns {Promise<any>}
     */
    login(data) {
      // console.log('login..');
      return axios.post('/auth/login', data);
    },

    /**
     * @typedef {Object} CurrentUserModel
     * @property {string} id
     * @property {string} fullName
     */
    /**
     * @returns {Promise<CurrentUserModel>}
     */
    me() {
      return axios.get('/users/me');
    },

    /**
     * @returns {Promise<any>}
     */
    logout() {
      return axios.post('/auth/logout');
    },
  },
};
