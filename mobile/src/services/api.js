import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fierce-bayou-11429.herokuapp.com',
});

export default api;
