import { getAuthHeaders, formatHTTPResponse } from '../../helpers/requests';

const getAllScans = () =>
  fetch('/api/ppgs', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders()
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
const getUserScans = data =>
  fetch(`/api/users/${data.userId}/ppg`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders()
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
const getScan = data =>
  fetch(`/api/ppg/${data.scanId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders()
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

export default {
  getAllScans,
  getUserScans,
  getScan
};
