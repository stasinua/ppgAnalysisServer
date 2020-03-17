const PPGScan = require("../../models/PPGScan");
const User = require("../../models/User");
const { encrypt, decrypt } = require("../../config/encryption");

function savePPGScan(ppgScan, user, preparedUserAge) {
  return new Promise((resolve, reject) => {
    PPGScan.findOne({ fileName: ppgScan.fileName }).exec().then(scan => {
      if (!scan) {
        const newScan = new PPGScan({
          fileName: ppgScan.fileName,
          userId: user._id,
          userName: encrypt(user.name),
          userUniqueIdentifier: encrypt(user.uniqueIdentifier),
          userBiologicalSex: ppgScan.biologicalSex || 'undefined',
          userAge: preparedUserAge,
          rawPPG: ppgScan.rawPPG,
          modifiedADT: ppgScan.modifiedADT,
          bandpassFilteredADT: ppgScan.bandpassFilteredADT,
          weightedPeaksAverageBPM: ppgScan.weightedPeaksAverageBPM,
          watchBPM: ppgScan.watchBPM,
          lowLight: ppgScan.lowLight,
          fingerMovement: ppgScan.fingerMovement
        });
        newScan.save(err => {
          if (!err) {
            resolve({
              success: true,
              message: "PPG scan saved!"
            });
          } else {
            reject(err);
          }
        });
      } else {
        resolve({
          success: true
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
}

exports.createPPGScan = req => {
  return new Promise((resolve, reject) => {
    let preparedUserName = req.body.ppgScan.userName.substring(
      0,
      req.body.ppgScan.userName.indexOf("_")
    );
    let preparedUserIdentifier = req.body.ppgScan.userName.substring(
      req.body.ppgScan.userName.indexOf("_") + 1,
      req.body.ppgScan.userName.length
    );
    let preparedUserAge = isNaN(parseInt(req.body.ppgScan.userAge)) ? 18 : parseInt(req.body.ppgScan.userAge);
    User.findOne({ name: preparedUserName, uniqueIdentifier: preparedUserIdentifier }).exec().then(user => {
      if (user) {
        console.log(1);
        savePPGScan(req.body.ppgScan, user, preparedUserAge).then(saveRes => {
          resolve(saveRes);
        }).catch(err => {
          reject(err);
        });
      } else {
        console.log(2, preparedUserName, preparedUserIdentifier);
        const newUser = new User({
          name: encrypt(preparedUserName),
          uniqueIdentifier: encrypt(preparedUserIdentifier),
          age: preparedUserAge,
          biologicalSex: req.body.ppgScan.biologicalSex || 'undefined'
        });
        newUser.save(err => {
          if (!err) {
            savePPGScan(req.body.ppgScan, newUser, preparedUserAge).then(saveRes => {
              resolve(saveRes);
            }).catch(err => {
              reject(err);
            });
          } else {
            console.log(err);
            reject(err);
          }
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
};

exports.getAllPPGScans = req => {
  return new Promise((resolve, reject) => {
    PPGScan.find({})
      .exec()
      .then(ppgScans => {
        if (ppgScans) {
          resolve({
            success: true,
            ppgScans: ppgScans
          });
        } else {
          resolve({
            success: true,
            ppgScans: []
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.getUserPPGScans = req => {
  return new Promise((resolve, reject) => {
    PPGScan.find({ userId: req.user._id})
      .exec()
      .then(scans => {
        if (scans) {
          scans.map(scan => {
            return {
              ...scan,
              userName: decrypt(scan.userName),
              userUniqueIdentifier: decrypt(scan.userUniqueIdentifier)
            }
          });
          resolve({
            success: true,
            scans: scans
          });
        } else {
          resolve({
            success: true,
            scans: []
          });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
