import createHistory from 'history/createBrowserHistory';

const history = createHistory();

// Listen for changes to the current location.
history.listen((location, action) => {
  // location is an object like window.location
});

export default history;
