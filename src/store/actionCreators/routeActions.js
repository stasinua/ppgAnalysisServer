import history from '../../history';

export function goToPageWithId_(type, id, tokenObj) {
  let path = '';

  if (type === 'post') {
    path = `/post/${id}`;
  }

  if (path) history.push(path);
  return {
    type: 'NEW_LOCATION',
    location: '/' + type + '/' + id,
    path
  };
}

export function goToPage_(type, additionalInfo) {
  let path = '/';
  if (type === 'ppgData') {
    path = '/ppgdata';
  } else if (type === 'login') {
    path = '/login';
  }

  if (path) history.push(path);
  return {
    type: 'NEW_LOCATION',
    location: '/' + type,
    path
  };
}

export function goBack_() {
  history.go(-1);
  return {
    type: 'BACK_LOCATION'
  };
}
