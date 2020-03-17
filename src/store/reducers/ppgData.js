import { createAsyncAction, createReducer } from '../../helpers/redux';

export const GET_ALL_SCANS = createAsyncAction('ppgData/GET_ALL_SCANS');
export const GET_USER_SCANS = createAsyncAction('ppgData/GET_USER_SCANS');
export const GET_SCAN = createAsyncAction('ppgData/GET_SCAN');
export const SET_SCANS= 'ppgData/SET_ALL_PPG';
export const SET_SCAN = 'ppgData/SET_USER_PPG';

const initialState = {
  scans: [],
  currentScan: {
    fileName: '',
    userName: '',
    userUniqueIdentifier: '',
    userAge: '',
    userBiologicalSex: '',
    rawPPG: '',
    modifiedADT: '',
    bandpassFilteredADT: '',
    weightedPeaksAverageBPM: '',
    watchBPM: '',
    lowLight: '',
    fingerMovement: ''
  }
};

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_SCANS:
      return {
        ...state,
        scans: action.scans
      };
    case SET_SCAN:
      return {
        ...state,
        currentScan: action.scan
    };
    default:
      return state;
  }
};
// export default createReducer(initialState, handlers);
