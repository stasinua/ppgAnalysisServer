const fs = require('fs');

const ppgDataController = require('./controllers/ppgData/ppgData');
const { delay } = require('./helpers/requests');

const pathToPPGDir = 'src/constants/phonePPG/new';

function readFilePromise(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${pathToPPGDir}/${file}`, 'utf8', (err, data) => {
      if (err) {
        console.log('fs read file error:', err);
        reject(err);
      } else {
        if (data) {
          resolve({
            success: true,
            fileName: file,
            fileContent: data
          });
        } else {
          resolve({
            success: false,
            fileName: file,
            message: `Empty content in "${file}"`
          });
        }
      }
    });
  });
}

function getFilesList(pathToPPGDir) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${pathToPPGDir}`, (err, filenames) => {
      if (err) {
        reject(err);
      } else {
        if (filenames) {
          resolve({
            success: true,
            filenames: filenames
          });
        } else {
          resolve({
            success: false,
            message: 'Empty directory'
          });
        }
      }
    });
  });
}

exports.savePPGToDatabase = () => {
  return new Promise((resolve, reject) => {
    getFilesList(pathToPPGDir).then(getFilesListRes => {
      if (getFilesListRes.success) {
        let fileReadPromises = getFilesListRes.filenames.map(file => {
          return readFilePromise(file);
        });

        Promise.all(fileReadPromises).then(fileReadRes => {
          let filteredResponses = fileReadRes.filter(elem => {
            return elem.success;
          });

          // let savePPGPromises = [];
          try {
            let errorCounter = 0;
            filteredResponses
              .reduce((promise, fileRes) => {
                const parsedPPG = JSON.parse(fileRes.fileContent);
                return promise.then(result => {
                  console.log('PROMISE THEN', result);
                  if (result.length === 2) {
                    if (!result[1].success) {
                      console.log('ERROR', result);
                      errorCounter++;
                    }
                  }
                  return Promise.all([
                    // Add 100ms delay before each save to enable proper database search response
                    delay(100),
                    ppgDataController.createPPGScan({
                      body: {
                        ppgScan: { ...parsedPPG, fileName: fileRes.fileName }
                      }
                    })
                  ]);
                });
              }, Promise.resolve({ type: 'initial' }))
              .then(results => {
                // console.log('delayedEmails THEN', results, errorCounter);
                if (!results || !results[1]) {
                  resolve({
                    success: false,
                    message: 'Error. Empty response from parsing service'
                  });
                } else {
                  if (errorCounter > 0) {
                    resolve({
                      success: false,
                      message: `${errorCounter} PPG scans have failed parsing. Please try again.`
                    });
                  } else if (errorCounter === filteredResponses.length) {
                    resolve({
                      success: false,
                      message: `${errorCounter} PPG scans have failed parsing. Please try again.`,
                      parsingError: true
                    });
                  } else if (errorCounter === 0) {
                    console.log('All PPG scans saved to database!');
                    resolve({
                      success: true,
                      message: 'All PPG scans saved to database!'
                    });
                  } else {
                    console.log('without handle');
                  }
                }
              })
              .catch(err => {
                reject(err);
              });
          } catch (e) {
            reject(e);
          }
        }).catch(err => {
          reject(err);
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
}
