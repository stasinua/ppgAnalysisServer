const mongoose = require('mongoose');

// function ignoreEmpty(val) {
//   if ('' === val) {
//     return undefined;
//   } else {
//     return val;
//   }
// }

var userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    uniqueIdentifier: { type: String, default: '' },
    age: { type: Number, default: 18 },
    biologicalSex: { type: String, default: 'undefined' }
  },
  { timestamps: true }
);


const User = mongoose.model('User', userSchema);

module.exports = User;
