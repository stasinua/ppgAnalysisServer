export const getAuthHeaders = () => {
  let userToken = '';
  try {
    userToken = window.localStorage.getItem('userToken');
  } catch (e) {
    alert(e);
  }
  return {
    'x-auth-token': userToken
  };
};

export function saveEventToken(eventId, tokenObj) {
  console.log(eventId, tokenObj);
  if (tokenObj && tokenObj.token) {
    try {
      let formattedToken = JSON.stringify({
        eventId: eventId,
        token: tokenObj.token
      });
      localStorage.setItem(tokenObj.type, formattedToken);
      return {
        success: true
      };
    } catch (e) {
      return {
        success: false,
        message: 'Failed to save request token. Please try again.'
      };
    }
  } else {
    return {
      success: false,
      message: 'Incorrect data given'
    };
  }
}

export function handleEventTokens(eventId) {
  let data = {};
  // Delete old event tokens if new event requested
  let sharedByToken = '';
  let gateToken = '';
  sharedByToken = localStorage.getItem('sharedByToken') || '';
  gateToken = localStorage.getItem('gateToken') || '';
  if (sharedByToken || gateToken) {
    try {
      const parsedSharedToken = sharedByToken ? JSON.parse(sharedByToken) : '';
      const parsedGateToken = gateToken ? JSON.parse(gateToken) : '';
      if (parsedSharedToken.eventId !== eventId) {
        console.log('del shared');
        localStorage.removeItem('sharedByToken');
      } else if (parsedGateToken.eventId !== eventId) {
        console.log('del gate');
        localStorage.removeItem('gateToken');
      }
      data.sharedByToken =
        sharedByToken && parsedSharedToken ? parsedSharedToken.token : '';
      data.gateToken =
        gateToken && parsedGateToken ? parsedGateToken.token : '';
    } catch (e) {
      console.warn('Failed to parse old token');
    }
  }

  return data;
}

export function formatHTTPResponse(response) {
  if (response.status !== 200) {
    return {
      success: false,
      error: {
        type: 'httpErrorCode',
        info: response.statusText,
        httpCode: response.status
      }
    };
  } else {
    return response.json();
  }
}
