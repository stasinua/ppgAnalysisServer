import { getAuthHeaders, formatHTTPResponse } from '../../helpers/requests';

const getUserData = () =>
  fetch('/api/account', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    credentials: 'include',
    body: JSON.stringify({
      includeVitality: false
    })
  })
    .then(response => {
      return formatHTTPResponse(response);
    })
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.log('Catched error: ', error);
    });

function logIn(data) {
  return fetch('/auth/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      name: data.name,
      uniqueIdentifier: data.uniqueIdentifier
    })
  })
    .then(response => {
      return formatHTTPResponse(response);
    })
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.log('Catched error: ', error);
    });
}

function logOut(data) {
  var userToken = '';
  try {
    userToken = window.localStorage.getItem('userToken');
  } catch (e) {
    alert(e);
  }
  return fetch('/auth/logout', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': userToken
    },
    credentials: 'include'
  })
    .then(response => {
      return formatHTTPResponse(response);
    })
    .then(responseJson => {
      return responseJson;
    })
    .catch(error => {
      console.log('Catched error: ', error);
    });
}

export default {
  getUserData,
  logIn,
  logOut
};
