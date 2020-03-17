import {
  GET_USER_SCANS,
  GET_SCAN,
  SET_SCANS,
  SET_SCAN
} from '../reducers/ppgData';

export function getUserScans_(userId) {
  return {
    type: GET_USER_SCANS.REQUEST,
    data: {
      userId
    }
  };
}

export function getScan_(scanId) {
  return {
    type: GET_SCAN.REQUEST,
    data: {
      scanId
    }
  };
}

export function setScans_(scans) {
  return {
    type: SET_SCANS,
    scans
  };
}

export function setScan_(scan) {
  return {
    type: SET_SCAN,
    scan
  };
}
