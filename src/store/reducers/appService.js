const initialState = {
  loadingScreen: false,
  storedEmail: '',
  storedLink: '',
  actionProgressMessage: {
    type: 'loading',
    errorType: '',
    actionCompleted: false,
    open: false,
    keepOpen: false,
    message: '',
    additionalMessage: '',
    withLink: {
      link: '',
      message: '',
      status: false,
      inline: false,
      withButton: false
    }
  },
  toast: {
    type: 'success',
    open: false,
    keepOpen: false,
    inline: false,
    message: '',
    withLink: {
      link: '',
      message: '',
      status: false,
      inline: false,
      actionType: ''
    },
    withButton: {
      buttonContent: '',
      buttonAction: '',
      inline: false,
      status: false
    },
    withIcon: false
  },
  unverifiedEmails: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_LOADING_SCREEN':
      return Object.assign({}, state, {
        loadingScreen: action.open
      });
      break;
    case 'SET_ACTION_PROGRESS':
      return Object.assign({}, state, {
        ...state,
        actionProgressMessage: {
          type: action.messageType,
          errorType: action.errorType,
          actionCompleted: action.actionCompleted,
          open: action.open,
          inline: action.inline,
          message: action.message,
          additionalMessage: action.additionalMessage,
          withLink: action.withLink.status
            ? action.withLink
            : initialState.toast.withLink,
          withButton: action.withButton.status
            ? action.withButton
            : initialState.toast.withButton
        }
      });
      break;
    case 'SET_ALERT_MESSAGE':
      return Object.assign({}, state, {
        toast: {
          type: 'error',
          open: action.inline ? false : true,
          keepOpen: action.keepOpen,
          inline: action.inline,
          message: action.message,
          withLink: action.withLink.status
            ? action.withLink
            : initialState.toast.withLink,
          withButton: action.withButton.status
            ? action.withButton
            : initialState.toast.withButton
        }
      });
      break;
    case 'SET_TOAST':
      return Object.assign({}, state, {
        toast: {
          type: 'success',
          open: action.open,
          keepOpen: action.keepOpen,
          message: action.message,
          withLink: action.withLink.status
            ? action.withLink
            : initialState.toast.withLink,
          withButton: action.withButton.status
            ? action.withButton
            : initialState.toast.withButton,
          withIcon: action.withIcon
        }
      });
      break;
    case 'UNVERIFIED_EMAILS_ALERT':
      return Object.assign({}, state, {
        unverifiedEmails: action.unverifiedEmails
      });
      break;
    case 'STORE_EMAIL':
      return Object.assign({}, state, {
        storedEmail: action.email
      });
    case 'STORE_LINK':
      return Object.assign({}, state, {
        storedLink: action.link
      });
    default:
      return state;
  }
};
