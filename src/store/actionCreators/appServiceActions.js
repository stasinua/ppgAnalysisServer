export function toggleLoadingScreen_(status) {
  return {
    type: 'TOGGLE_LOADING_SCREEN',
    open: status === true ? true : false
  };
}

export function setAlertMessage_(message, withLink, inline, keepOpen) {
  // If 'withButton' and 'inline' object is present alert message should have ':link:' insert
  // This ':link:' insert will indicate link placement inside text
  // If ':link:' is not specified then link will be placed at the end of a message
  let preparedAction = {
    type: 'SET_ALERT_MESSAGE',
    keepOpen: true, // Default behaviour according to #931(https://github.com/ericsond/papercut/issues/931)
    message: '',
    inline: inline === true ? true : false,
    withLink: { status: false },
    withButton: {
      status: false
    }
  };
  if (message) {
    if (typeof message === 'string' || typeof message === 'number') {
      preparedAction.message = message;
    } else {
      console.warn('Invalid "message" type');
      preparedAction.message = '';
    }
  } else {
    preparedAction.message = '';
  }
  if (withLink && typeof withLink === 'object') {
    if (withLink.status) {
      if (withLink.link) {
        if (typeof withLink.link === 'string' && withLink.link.length > 0) {
          preparedAction.withLink.link = withLink.link;
        }
      }
      if (withLink.message) {
        if (
          typeof withLink.message === 'string' &&
          withLink.message.length > 0
        ) {
          preparedAction.withLink.message = withLink.message;
        }
      }
      preparedAction.withLink.withButton = withLink.withButton;
      preparedAction.withLink.status = true;
    } else {
      preparedAction.withLink = { status: false };
    }
  }
  if (message) {
    return preparedAction;
  }
}
export const setAlertMessageUnableToConnect = () => ({
  type: 'SET_ALERT_MESSAGE',
  open: true,
  message: 'Unable to connect websockets. Please check connection.',
  withLink: {
    status: false
  }
});

export function unverifiedEmailsAlert_(unverifiedEmails) {
  // TODO: Perform minimal check for Array[String] format
  return {
    type: 'UNVERIFIED_EMAILS_ALERT',
    unverifiedEmails: unverifiedEmails
      ? unverifiedEmails.length > 0 && typeof unverifiedEmails === 'object'
        ? unverifiedEmails
        : []
      : []
  };
}

export function closeToast_() {
  return {
    type: 'SET_TOAST',
    open: false,
    keepOpen: false,
    inline: false,
    message: '',
    withLink: {
      status: false,
      withButton: false
    },
    withButton: {
      status: false
    }
  };
}

export function openToast_(message, withLink, keepOpen, withButton, withIcon) {
  // If 'withButton' object is present toast message should have ':buttonContent:' insert
  // This ':buttonContent:' insert will indicate button placement inside text
  // If ':buttonContent:' is not specified then button will be placed at the end of a message
  let preparedAction = {
    type: 'SET_TOAST',
    keepOpen: keepOpen === true ? true : false,
    open: true,
    message: '',
    withLink: { status: false },
    withButton: { status: false },
    withIcon: false
  };

  if (message) {
    if (typeof message === 'string' || typeof message === 'number') {
      preparedAction.message = message;
    } else {
      console.warn('Invalid "message" type');
      preparedAction.message = '';
    }
  } else {
    preparedAction.message = '';
  }
  if (withLink && typeof withLink === 'object') {
    if (withLink.status) {
      if (withLink.link) {
        if (typeof withLink.link === 'string' && withLink.link.length > 0) {
          preparedAction.withLink.link = withLink.link;
        }
      }
      if (withLink.message) {
        if (
          typeof withLink.message === 'string' &&
          withLink.message.length > 0
        ) {
          preparedAction.withLink.message = withLink.message;
        }
      }
      preparedAction.withLink.status = true;
      preparedAction.withLink.inline = withLink.inline;
      preparedAction.withLink.actionType = withLink.actionType;
    } else {
      preparedAction.withLink = { status: false };
    }
  }

  if (withButton && typeof withButton === 'object') {
    if (withButton.status) {
      if (withButton.buttonContent && withButton.buttonAction) {
        if (
          typeof withButton.buttonContent === 'string' &&
          withButton.buttonContent.length > 0
        ) {
          preparedAction.withButton.buttonContent = withButton.buttonContent;
        }
        if (
          typeof withButton.buttonAction === 'string' &&
          withButton.buttonAction.length > 0
        ) {
          preparedAction.withButton.buttonAction = withButton.buttonAction;
        }
        preparedAction.withButton.status = true;
        preparedAction.withButton.inline = withButton.inline;
      } else {
        preparedAction.withButton = { status: false };
      }
    } else {
      preparedAction.withButton = { status: false };
    }
  }

  preparedAction.withIcon = withIcon;

  if (message) {
    return preparedAction;
  }
}

export function openActionProgress_(
  messageType,
  errorType,
  message,
  additionalMessage,
  actionCompleted,
  withLink
) {
  let preparedAction = {
    type: 'SET_ACTION_PROGRESS',
    messageType: 'loading',
    errorType: '',
    message: '',
    additionalMessage: '',
    actionCompleted: actionCompleted === true ? true : false,
    withLink: { status: false },
    withButton: {
      status: false
    },
    open: true
  };

  if (messageType) {
    if (typeof messageType === 'string') {
      preparedAction.messageType = messageType;
    } else {
      console.warn('Invalid "messageType" type');
      preparedAction.messageType = 'loading';
    }
  } else {
    preparedAction.messageType = 'loading';
  }
  if (errorType) {
    if (typeof errorType === 'string') {
      preparedAction.errorType = errorType;
    } else {
      console.warn('Invalid "errorType" type');
      preparedAction.errorType = '';
    }
  } else {
    preparedAction.errorType = '';
  }
  if (message) {
    if (typeof message === 'string' || typeof message === 'number') {
      preparedAction.message = message;
    } else {
      console.warn('Invalid "message" type');
      preparedAction.message = '';
    }
  } else {
    preparedAction.message = '';
  }
  if (additionalMessage) {
    if (
      typeof additionalMessage === 'string' ||
      typeof additionalMessage === 'number'
    ) {
      preparedAction.additionalMessage = additionalMessage;
    } else {
      console.warn('Invalid "additionalMessage" type');
      preparedAction.additionalMessage = '';
    }
  } else {
    preparedAction.additionalMessage = '';
  }
  if (withLink && typeof withLink === 'object') {
    if (withLink.status) {
      if (withLink.link) {
        if (typeof withLink.link === 'string' && withLink.link.length > 0) {
          preparedAction.withLink.link = withLink.link;
        }
      }
      if (withLink.message) {
        if (
          typeof withLink.message === 'string' &&
          withLink.message.length > 0
        ) {
          preparedAction.withLink.message = withLink.message;
        }
      }
      preparedAction.withLink.status = true;
    } else {
      preparedAction.withLink = { status: false };
    }
  }
  return preparedAction;
}

export function closeActionProgress_() {
  return {
    type: 'SET_ACTION_PROGRESS',
    messageType: 'success',
    message: '',
    actionCompleted: false,
    withLink: { status: false },
    withButton: {
      status: false
    },
    open: false
  };
}
