const mongoose = require('mongoose');

// function ignoreEmpty(val) {
//   if ('' === val) {
//     return undefined;
//   } else {
//     return val;
//   }
// }

var PPGScanSchema = new mongoose.Schema(
  {
    fileName: { type: String, default: 'undefined' },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: { type: String, default: 'undefined' },
    userUniqueIdentifier: { type: String, default: 'undefined' },
    userAge: { type: Number, default: 18 },
    userBiologicalSex: { type: String, default: 'undefined' },
    rawPPG: { type: Array, default: [] },
    modifiedADT: { type: Number, default: 0 },
    bandpassFilteredADT: { type: Number, default: 0 },
    weightedPeaksAverageBPM: { type: Number, default: 0 },
    watchBPM: { type: Array, default: [] },
    lowLight: { type: Boolean, default: false },
    fingerMovement: { type: Boolean, default: false }
  },
  { timestamps: true }
);


const PPGScan = mongoose.model('PPGScan', PPGScanSchema);

module.exports = PPGScan;
