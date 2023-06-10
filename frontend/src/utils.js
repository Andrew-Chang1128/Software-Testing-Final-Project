import { useState } from 'react';

const SERVER_URL = 'https://test/david.exodus.tw/SoftwareTestingProject';

export async function fetchGet(api, auth, req) {
  const param = new URLSearchParams(req);
  const url = `${SERVER_URL}${api}?${param}`;
  let headers = {'Content-Type': 'application/json'}
  if (auth) {
    const token = getToken();
    headers['authorization'] = `Bearer ${token}`;
  }
  const requestOptions = {
    method: 'GET',
    headers: headers
  };
  return fetch(url, requestOptions)
    .then((res) => {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) { return res.json();}
      else {return res.text();}
    })
    .catch((error) => {throw error;});
};

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

export function strToNum(s) {
  return +s.replace(/[^\d.-]/g, '');
}