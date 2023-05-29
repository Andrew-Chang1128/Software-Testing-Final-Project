import { useState } from 'react';

const SERVER_URL = 'https://test/david.exodus.tw/CloudNativeProject';

// fetch api from unauthorized endpoint, ex: /user
export async function fetchUnAuth(api, req) {
  const url = `${SERVER_URL}${api}`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req)
  };
  return fetch(url, requestOptions)
    .then((res) => res.json())
    .catch((error) => {throw error;});
};

// fetch api from authorized endpoint, ex: /allRoutes
export async function fetchAuth(api, req) {
  const token = getToken();
  const url = `${SERVER_URL}${api}`;
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(req)
  };
  return fetch(url, requestOptions)
    .then((res) => res.json())
    .catch((error) => {throw error;});
};


// get token utility
export function getToken() {
  const userToken = sessionStorage.getItem('token');
  if (!userToken) {
    return null;
  }
  return userToken;
};

// customized hook for set token
export function useToken() {
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    sessionStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return [token, saveToken];
}

