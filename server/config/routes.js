const domainName = 'ppganalyzer.io';
const pathToFrontend =
  process.env.NODE_ENV === 'production'
    ? 'build/index.html'
    : 'public/index.html';

const publicURL =
  process.env.NODE_ENV === 'production'
    ? 'https://' + domainName
    : 'https://localhost:3000';

module.exports = {
  publicURL,
  pathToFrontend
};
