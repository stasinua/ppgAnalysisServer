import { calculateStandardDeviation } from './signalParameters';

export const calculateWeightedPeaksBPM = (dataArr, frameRate) => {
  // Based on: https://pdfs.semanticscholar.org/1d60/4572ec6ed77bd07fbb4e9fc32ab5271adedb.pdf

  const weight = 1.2; // typically 1 <= h <= 3

  // Number of frames for peak occurence.
  const windowSize = {
    min: (10 * frameRate) / 26, // Corresponds to 160BPM
    max: (10 * frameRate) / 10 // Corresponds to 60BPM
  }; // window size around the peak

  console.log("calculateWeightedPeaksBPM: windowSize:", windowSize);

  const averageAmplitude =
    dataArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    ) / dataArr.length;

  const standardDeviation = calculateStandardDeviation(
    dataArr,
    averageAmplitude
  );

  let peaksArray = [];

  for (var i = 0; i < dataArr.length; i++) {
    if (dataArr[i] - averageAmplitude > weight * standardDeviation) {
      peaksArray.push({
        index: i,
        value: dataArr[i]
      });
    }
  }

  console.log("calculateWeightedPeaksBPM: peaksArray:", peaksArray);

  const filteredPeaks = peaksArray.filter((element, peakIndex) => {
    if (peakIndex + 1 <= peaksArray.length - 1) {
      if (
        Math.abs(
          peaksArray[peakIndex].index - peaksArray[peakIndex + 1].index
        ) < windowSize.min || Math.abs(
          peaksArray[peakIndex].index - peaksArray[peakIndex + 1].index
        ) > windowSize.max
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  });

  console.log("calculateWeightedPeaksBPM: filteredPeaks:", filteredPeaks);

  const simpleBPM = filteredPeaks.length * 6; // For scan period of 10 seconds
  let periodsBetweenPeaks = [];

  filteredPeaks.forEach((element, peakIndex) => {
    if (peakIndex + 1 <= filteredPeaks.length - 1) {
      periodsBetweenPeaks.push(
        Math.abs(
          filteredPeaks[peakIndex].index - filteredPeaks[peakIndex + 1].index
        )
      );
    }
  });
  console.log(periodsBetweenPeaks);
  let peaksPeriodBPM = 0;
  if (periodsBetweenPeaks.length > 0) {
    peaksPeriodBPM =
      (frameRate /
        (periodsBetweenPeaks.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }) /
          periodsBetweenPeaks.length)) *
      60; // Independent from scan period
  }

  return {
    simpleBPM,
    peaksPeriodBPM
  };
}

export const calculateAutocorrelationBPM = (dataArr) => {
  const frameRate = dataArr.length / 10;
  const ascSortedDataArr = dataArr.slice().sort((a, b) => {
    return a - b;
  });

  let minPeakIndex = 0;
  let searchArea = [];

  for (let i = 0; i < dataArr.length; i++) {
    if (dataArr[i] === ascSortedDataArr[0]) {
      minPeakIndex = i;
    } else {
      if (minPeakIndex !== 0) {
        if (i > minPeakIndex) {
          searchArea.push(dataArr[i]);
        }
      }
    }
  }

  const descSortedSearchArea = searchArea.slice().sort((a, b) => {
    return b - a;
  });

  let maxPeakIndex = 0;

  for (let dataArrCount = 0; dataArrCount < dataArr.length; dataArrCount++) {
    if (dataArr[dataArrCount] === descSortedSearchArea[0]) {
      maxPeakIndex = dataArrCount;
    }
  }

  console.log("minPeakIndex:", minPeakIndex);
  console.log("maxPeakIndex:", maxPeakIndex);

  return Math.abs(60 * (frameRate / maxPeakIndex));
}

// calculateADT(dataArr) {
//   const frameRate = 120; // Frames per second
//   const refractoryPeriod = 5; // Frames
//   const slopeChangeRate = {
//     vMax: -0.6,
//     vMin: 0.6
//   };
//   const averageAmplitude =
//     dataArr.reduce(
//       (accumulator, currentValue) => accumulator + currentValue
//     ) / dataArr.length;
//
//   const descSortedDataArr = dataArr.slice().sort((a, b) => {
//     return b - a;
//   });
//
//   const PPGMax = descSortedDataArr[0];
//   const PPGMin = descSortedDataArr[dataArr.length - 1];
//
//   // Slope initial amplitudes
//   const vMaxSlopeInit = 0.2 * PPGMax;
//   const vMinSlopeInit = 0.2 * PPGMin;
//
//   const standardDeviation = this.calculateStandardDeviation(
//     dataArr,
//     averageAmplitude
//   );
//
//   console.log('Initial values:');
//   console.log('averageAmplitude:', averageAmplitude);
//   console.log('PPGMax:', PPGMax);
//   console.log('PPGMin:', PPGMin);
//   console.log('vMaxSlopeInit:', vMaxSlopeInit);
//   console.log('vMinSlopeInit:', vMinSlopeInit);
//   console.log('standardDeviation:', standardDeviation);
//
//   // Calculation data holders
//   let slopeValue = 0;
//   let slopeValues = [];
//   let followPPG = false;
//   let peaks = [];
//
//   let averagePulseInterval = 0; // Frames
//
//   for (var i = 0; i < dataArr.length; i++) {
//     if (i === 0) {
//       console.log('Initial step');
//       slopeValue = this.calculateSlope(vMinSlopeInit, slopeChangeRate.vMin, 0, standardDeviation, frameRate);
//       slopeValues.push(slopeValue);
//       followPPG = this.isSlopeMatchWithPPG(dataArr, slopeValue, i);
//     } else {
//       // console.log('Another step index:', i);
//       if (followPPG) {
//         console.log('followPPG "true"', i, slopeValue);
//         if (dataArr[i] > dataArr[i + 1]) {
//           if (peaks.length > 0) {
//             if (this.isCorrectPeak(i, { min: peaks[peaks.length - 1].index, max: peaks[peaks.length - 1].index + refractoryPeriod})) {
//               peaks.push({
//                 index: i,
//                 value: dataArr[i]
//               });
//               followPPG = false;
//             } else {
//               slopeValues.push(dataArr[i]);
//             }
//           } else {
//             peaks.push({
//               index: i,
//               value: dataArr[i]
//             });
//             followPPG = false;
//           }
//         } else {
//           slopeValues.push(dataArr[i]);
//         }
//       } else {
//         // console.log('followPPG "false"', i, slopeValue);
//         slopeValue = this.calculateSlope(slopeValues[i - 1], slopeChangeRate.vMin, peaks[peaks.length - 1] || 0, standardDeviation, frameRate);
//         slopeValues.push(slopeValue);
//         followPPG = this.isSlopeMatchWithPPG(dataArr, slopeValue, i);
//       }
//     }
//   }
//
//   return {
//     slopeValues: slopeValues,
//     peaks: peaks
//   };
// }
//
//
// calculateSlope(
//   previousMeanSlopeAmp,
//   slopeChangeRate,
//   previousPeakAmp,
//   standardDeviation,
//   samplingFrequency
// ) {
//   // console.log('calculateSlope: previousMeanSlopeAmp', previousMeanSlopeAmp);
//   // console.log('calculateSlope: slopeChangeRate', slopeChangeRate);
//   // console.log('calculateSlope: previousPeakAmp', previousPeakAmp);
//   // console.log('calculateSlope: standardDeviation', standardDeviation);
//   // console.log('calculateSlope: samplingFrequency', samplingFrequency);
//   return (
//     previousMeanSlopeAmp +
//     slopeChangeRate *
//       ((previousPeakAmp + standardDeviation) / samplingFrequency)
//   );
// }
//
// isSlopeMatchWithPPG(dataArr, slopeValue, slopeIndex) {
//   console.log('Is match?', dataArr[slopeIndex], slopeValue);
//   if (dataArr[slopeIndex] === slopeValue) {
//     return true;
//   } else {
//     return false;
//   }
// }
//
// isCorrectPeak(peakIndex, refractoryPeriod) {
//   if (refractoryPeriod.min < peakIndex < refractoryPeriod.max) {
//     return false;
//   } else {
//     return true;
//   }
// }
