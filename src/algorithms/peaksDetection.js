import { calculateStandardDeviation, arrayAverage } from "./signalParameters";

export const calculateWeightedPeaksBPM = (
  dataArr,
  frameRate,
  averageAmplitudeVarianceArr
) => {
  // Based on: https://pdfs.semanticscholar.org/1d60/4572ec6ed77bd07fbb4e9fc32ab5271adedb.pdf

  let weight = 1.2; // typically 1 <= h <= 3

  // Number of frames for peak occurence.
  const windowSize = {
    min: (10 * frameRate) / 26, // Corresponds to 160BPM
    max: (10 * frameRate) / 10 // Corresponds to 60BPM
  }; // window size around the peak

  console.log("calculateWeightedPeaksBPM: windowSize:", windowSize);

  const averageAmplitude = arrayAverage(dataArr);

  const standardDeviation = calculateStandardDeviation(
    dataArr,
    averageAmplitude
  );

  // const testDataArr = averageAmplitudeVarianceArr;
  //
  // const testAverageAmplitude =
  //   testDataArr.reduce(
  //     (accumulator, currentValue) => accumulator + currentValue
  //   ) / testDataArr.length;
  //
  // const testStandardDeviation = calculateStandardDeviation(
  //   testDataArr,
  //   testAverageAmplitude
  // );
  //
  // console.log("Test params:", testAverageAmplitude, testStandardDeviation, testAverageAmplitude / testStandardDeviation);

  let peaksArray = [];

  if (averageAmplitudeVarianceArr) {
    // Moving average dependent algorithm
    let amplitudeDifferencePercentage = 0;
    for (let i = 0; i < dataArr.length; i++) {
      amplitudeDifferencePercentage += Math.abs(
        ((dataArr[i] - averageAmplitudeVarianceArr[i]) / averageAmplitude) * 100
      );
    }
    const averageAmplitudeDifference =
      amplitudeDifferencePercentage / dataArr.length;
    console.log(
      "averageAmplitudeDifference(in %):",
      averageAmplitudeDifference
    );
    if (averageAmplitudeDifference > 0) {
      weight =
        averageAmplitudeDifference < 1
          ? 0.7
          : averageAmplitudeDifference > 1.5
          ? 1.2
          : 1.1;
      console.log("Adjusted weight:", weight);
      for (let i = 0; i < dataArr.length; i++) {
        if (
          dataArr[i] - averageAmplitudeVarianceArr[i] >
          weight * standardDeviation
        ) {
          peaksArray.push({
            index: i,
            value: dataArr[i]
          });
        }
      }
    } else {
      for (let i = 0; i < dataArr.length; i++) {
        if (
          dataArr[i] - averageAmplitudeVarianceArr[i] >
          weight * standardDeviation
        ) {
          peaksArray.push({
            index: i,
            value: dataArr[i]
          });
        }
      }
    }
  } else {
    // Default algorithm
    for (var i = 0; i < dataArr.length; i++) {
      if (dataArr[i] - averageAmplitude > weight * standardDeviation) {
        peaksArray.push({
          index: i,
          value: dataArr[i]
        });
      }
    }
  }

  console.log("calculateWeightedPeaksBPM: peaksArray:", peaksArray);

  const filteredPeaks = peaksArray.filter((element, peakIndex) => {
    if (peakIndex + 1 <= peaksArray.length - 1) {
      if (
        Math.abs(
          peaksArray[peakIndex].index - peaksArray[peakIndex + 1].index
        ) < windowSize.min ||
        Math.abs(
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
  // console.log(periodsBetweenPeaks);
  let peaksPeriodBPM = 0;
  if (periodsBetweenPeaks.length > 0) {
    peaksPeriodBPM = (frameRate / arrayAverage(periodsBetweenPeaks)) * 60; // Independent from scan period
  }

  return {
    simpleBPM,
    peaksPeriodBPM
  };
};

export const calculateAutocorrelationBPM = dataArr => {
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
};

export const calculateADT = (dataArr, frameRate) => {
  const refractoryPeriod = {
    min: (10 * frameRate) / 26, // Corresponds to 160BPM
    max: (10 * frameRate) / 10 // Corresponds to 60BPM
  }; // Frames
  const slopeChangeRate = {
    vMax: -0.9,
    vMin: 0.9
  };
  const averageAmplitude = arrayAverage(dataArr);

  const descSortedDataArr = dataArr.slice().sort((a, b) => {
    return b - a;
  });

  const PPGMax = descSortedDataArr[0];
  const PPGMin = descSortedDataArr[dataArr.length - 1];

  // Slope initial amplitudes
  // const vMaxSlopeInit = 0.2 * PPGMax;
  // const vMinSlopeInit = 0.2 * PPGMin;
  const vMaxSlopeInit = PPGMax;
  const vMinSlopeInit = PPGMin;

  const standardDeviation = calculateStandardDeviation(
    dataArr,
    averageAmplitude
  );

  console.log("Initial values:");
  console.log("averageAmplitude:", averageAmplitude);
  console.log("PPGMax:", PPGMax);
  console.log("PPGMin:", PPGMin);
  console.log("vMaxSlopeInit:", vMaxSlopeInit);
  console.log("vMinSlopeInit:", vMinSlopeInit);
  console.log("standardDeviation:", standardDeviation);

  // Calculation data holders
  let slopeValue = 0;
  let slopeValues = [];
  let followPPG = false;
  let peaks = [];
  let previousPeaksLength = 0;

  let averagePulseInterval = 0; // Frames

  for (var i = 0; i < dataArr.length; i++) {
    if (i === 0) {
      console.log("Initial step");
      slopeValue = calculateSlope(
        vMinSlopeInit,
        slopeChangeRate.vMin,
        0,
        standardDeviation,
        frameRate
      );
      slopeValues.push(slopeValue);
      followPPG = isSlopeMatchWithPPG(
        dataArr,
        slopeValue,
        i,
        standardDeviation
      );
    } else {
      // console.log('Another step index:', i);
      if (followPPG) {
        // console.log('followPPG "true"', i, slopeValue);
        if (
          dataArr[i] > dataArr[i + 1] &&
          dataArr[i + 1] > dataArr[i + 2] &&
          dataArr[i + 2] > dataArr[i + 3]
        ) {
          // console.log(
          //   "PEAK DETECTED:",
          //   dataArr[i] > dataArr[i + 1],
          //   dataArr[i],
          //   dataArr[i + 1]
          // );
          if (peaks.length > 0) {
            if (peaks.length > 1) {
              if (
                isCorrectPeak(i, {
                  min: peaks[peaks.length - 1].index + refractoryPeriod.min,
                  max: peaks[peaks.length - 1].index + refractoryPeriod.max
                })
              ) {
                previousPeaksLength = peaks.length;
                peaks.push({
                  index: i,
                  value: dataArr[i]
                });
                followPPG = false;
                slopeValues.push(dataArr[i]);
              } else {
                slopeValues.push(dataArr[i]);
              }
            } else {
              if (
                isCorrectPeak(i, {
                  min: peaks[peaks.length - 1].index + refractoryPeriod.min,
                  max: peaks[peaks.length - 1].index + refractoryPeriod.max
                })
              ) {
                peaks.push({
                  index: i,
                  value: dataArr[i]
                });
                followPPG = false;
                slopeValues.push(dataArr[i]);
              } else {
                slopeValues.push(dataArr[i]);
              }
            }
          } else {
            peaks.push({
              index: i,
              value: dataArr[i]
            });
            followPPG = false;
            slopeValues.push(dataArr[i]);
          }
        } else {
          slopeValues.push(dataArr[i]);
        }
      } else {
        // console.log('followPPG "false"', i, slopeValue);
        // Classic ADT
        if (peaks.length > previousPeaksLength) {
          console.log("here");
          slopeValue = calculateSlope(
            slopeValues[i - 1],
            slopeChangeRate.vMax,
            peaks.length > 0 ? peaks[peaks.length - 1].value : 0,
            standardDeviation,
            frameRate
          );
          slopeValues.push(slopeValue);
          followPPG = isSlopeMatchWithPPG(
            dataArr,
            slopeValue,
            i,
            standardDeviation
          );
        } else {
          slopeValue = calculateSlope(
            slopeValues[i - 1],
            slopeChangeRate.vMin,
            peaks.length > 0 ? peaks[peaks.length - 1].value : 0,
            standardDeviation,
            frameRate
          );
          slopeValues.push(slopeValue);
          followPPG = isSlopeMatchWithPPG(
            dataArr,
            slopeValue,
            i,
            standardDeviation
          );
        }
      }
    }
  }

  let periodsBetweenPeaks = [];

  peaks.forEach((element, peakIndex) => {
    if (peakIndex + 1 <= peaks.length - 1) {
      periodsBetweenPeaks.push(
        Math.abs(peaks[peakIndex].index - peaks[peakIndex + 1].index)
      );
    }
  });

  let peaksPeriodBPM = 0;
  if (periodsBetweenPeaks.length > 0) {
    peaksPeriodBPM = (frameRate / arrayAverage(periodsBetweenPeaks)) * 60; // Independent from scan period
  }

  console.log("calculateADT:", {
    peaks,
    peaksPeriodBPM
  });

  return {
    slopeValues: slopeValues,
    peaks: peaks,
    peaksPeriodBPM: peaksPeriodBPM
  };
};

function calculateSlope(
  previousMeanSlopeAmp,
  slopeChangeRate,
  previousPeakAmp,
  standardDeviation,
  samplingFrequency
) {
  // console.log('calculateSlope: previousMeanSlopeAmp', previousMeanSlopeAmp);
  // console.log('calculateSlope: slopeChangeRate', slopeChangeRate);
  // console.log('calculateSlope: previousPeakAmp', previousPeakAmp);
  // console.log('calculateSlope: standardDeviation', standardDeviation);
  // console.log('calculateSlope: samplingFrequency', samplingFrequency);
  return (
    previousMeanSlopeAmp +
    (slopeChangeRate *
      ((previousPeakAmp + standardDeviation) / samplingFrequency))
  );
}

function isSlopeMatchWithPPG(
  dataArr,
  slopeValue,
  slopeIndex,
  standardDeviation
) {
  // Example closer to ADT original
  // if (Math.abs(slopeValue - dataArr[slopeIndex]) <= standardDeviation * 0.1) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  // Working example for weights > 1.2
  // if (slopeValue >= dataArr[slopeIndex]) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  // Working example for weights < 1.2
  // if (
  //   slopeValue + standardDeviation * 0.1 >= dataArr[slopeIndex]
  // ) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  //Test
  if (
    slopeValue + standardDeviation * 0.1 >= dataArr[slopeIndex]
    // slopeValue - standardDeviation * 0.1 <= dataArr[slopeIndex]
  ) {
    // console.log("Is match?", true);
    return true;
  } else {
    // console.log('Is match index', slopeIndex);
    // console.log('Is match?', dataArr[slopeIndex], slopeValue);
    return false;
  }
}

function isCorrectPeak(peakIndex, refractoryPeriod) {
  if (peakIndex > refractoryPeriod.min && peakIndex < refractoryPeriod.max) {
    // console.log("isCorrectPeak: true", peakIndex);
    return true;
  } else {
    // console.log("isCorrectPeak: false", peakIndex);
    // console.log("isCorrectPeak: refractoryPeriod.min", refractoryPeriod.min);
    // console.log("isCorrectPeak: refractoryPeriod.max", refractoryPeriod.max);
    return false;
  }
}

export const calculateModifiedADT = (dataArr, frameRate) => {
  const refractoryPeriod = {
    min: (10 * frameRate) / 26, // Corresponds to 160BPM
    max: (10 * frameRate) / 10 // Corresponds to 60BPM
  }; // Frames
  const slopeChangeRate = {
    vMax: -0.9,
    vMin: 0.9
  };
  const averageAmplitude = arrayAverage(dataArr);

  const descSortedDataArr = dataArr.slice().sort((a, b) => {
    return b - a;
  });

  const PPGMax = descSortedDataArr[0];
  const PPGMin = descSortedDataArr[dataArr.length - 1];

  // Slope initial amplitudes
  // const vMaxSlopeInit = 0.2 * PPGMax;
  // const vMinSlopeInit = 0.2 * PPGMin;
  const vMaxSlopeInit = PPGMax;
  const vMinSlopeInit = PPGMin;

  const standardDeviation = calculateStandardDeviation(
    dataArr,
    averageAmplitude
  );

  console.log("Initial values:");
  console.log("averageAmplitude:", averageAmplitude);
  console.log("PPGMax:", PPGMax);
  console.log("PPGMin:", PPGMin);
  console.log("vMaxSlopeInit:", vMaxSlopeInit);
  console.log("vMinSlopeInit:", vMinSlopeInit);
  console.log("standardDeviation:", standardDeviation);

  // Calculation data holders
  let slopeValue = 0;
  let slopeValues = [];
  let followPPG = false;
  let peaks = [];
  let previousPeaksLength = 0;

  let averagePulseInterval = 0; // Frames

  for (var i = 0; i < dataArr.length; i++) {
    if (i === 0) {
      console.log("Initial step");
      slopeValue = calculateSlopeMod(
        vMinSlopeInit,
        slopeChangeRate.vMin,
        0,
        standardDeviation,
        frameRate
      );
      slopeValues.push(slopeValue);
      followPPG = isSlopeMatchWithPPGMod(
        dataArr,
        slopeValue,
        i,
        standardDeviation
      );
    } else {
      // console.log('Another step index:', i);
      if (followPPG) {
        // console.log('followPPG "true"', i, slopeValue);
        if (
          dataArr[i] > dataArr[i + 1] &&
          dataArr[i + 1] > dataArr[i + 2] &&
          dataArr[i + 2] > dataArr[i + 3]
        ) {
          // console.log(
          //   "PEAK DETECTED:",
          //   dataArr[i] > dataArr[i + 1],
          //   dataArr[i],
          //   dataArr[i + 1]
          // );
          if (peaks.length > 0) {
            if (peaks.length > 1) {
              if (
                isCorrectPeakMod(i, {
                  min: peaks[peaks.length - 1].index + refractoryPeriod.min,
                  max: peaks[peaks.length - 1].index + refractoryPeriod.max
                })
              ) {
                previousPeaksLength = peaks.length;
                peaks.push({
                  index: i,
                  value: dataArr[i]
                });
                followPPG = false;
                slopeValues.push(dataArr[i]);
              } else {
                slopeValues.push(dataArr[i]);
              }
              // Has problems with "ppgScan_1572260769603"
              // if (
              //   isCorrectPeak(i, {
              //     min: peaks[peaks.length - 1].index + refractoryPeriod.min,
              //     max:
              //       peaks[peaks.length - 1].index +
              //       arrayAverage(peaks, 'index')
              //   })
              // ) {
              //   peaks.push({
              //     index: i,
              //     value: dataArr[i]
              //   });
              //   followPPG = false;
              //   slopeValues.push(dataArr[i]);
              // } else {
              //   slopeValues.push(dataArr[i]);
              // }
            } else {
              if (
                isCorrectPeakMod(i, {
                  min: peaks[peaks.length - 1].index + refractoryPeriod.min,
                  max: peaks[peaks.length - 1].index + refractoryPeriod.max
                })
              ) {
                peaks.push({
                  index: i,
                  value: dataArr[i]
                });
                followPPG = false;
                slopeValues.push(dataArr[i]);
              } else {
                slopeValues.push(dataArr[i]);
              }
            }
          } else {
            peaks.push({
              index: i,
              value: dataArr[i]
            });
            followPPG = false;
            slopeValues.push(dataArr[i]);
          }
        } else {
          slopeValues.push(dataArr[i]);
        }
      } else {
        // console.log('followPPG "false"', i, slopeValue);
        // Classic ADT
        // if (peaks.length > previousPeaksLength) {
        //   console.log("here");
        //   slopeValue = calculateSlope(
        //     slopeValues[i - 1],
        //     slopeChangeRate.vMax,
        //     peaks.length > 0 ? peaks[peaks.length - 1].value : 0,
        //     standardDeviation,
        //     frameRate
        //   );
        //   slopeValues.push(slopeValue);
        //   followPPG = isSlopeMatchWithPPG(
        //     dataArr,
        //     slopeValue,
        //     i,
        //     standardDeviation
        //   );
        // } else {
          slopeValue = calculateSlopeMod(
            slopeValues[i - 1],
            slopeChangeRate.vMin,
            peaks.length > 0 ? peaks[peaks.length - 1].value : 0,
            standardDeviation,
            frameRate
          );
          slopeValues.push(slopeValue);
          followPPG = isSlopeMatchWithPPGMod(
            dataArr,
            slopeValue,
            i,
            standardDeviation
          );
        // }
      }
    }
  }

  let periodsBetweenPeaks = [];

  peaks.forEach((element, peakIndex) => {
    if (peakIndex + 1 <= peaks.length - 1) {
      periodsBetweenPeaks.push(
        Math.abs(peaks[peakIndex].index - peaks[peakIndex + 1].index)
      );
    }
  });

  let peaksPeriodBPM = 0;
  if (periodsBetweenPeaks.length > 0) {
    peaksPeriodBPM = (frameRate / arrayAverage(periodsBetweenPeaks)) * 60; // Independent from scan period
  }

  console.log("calculateADT:", {
    peaks,
    peaksPeriodBPM
  });

  return {
    slopeValues: slopeValues,
    peaks: peaks,
    peaksPeriodBPM: peaksPeriodBPM
  };
};

function calculateSlopeMod(
  previousMeanSlopeAmp,
  slopeChangeRate,
  previousPeakAmp,
  standardDeviation,
  samplingFrequency
) {
  // console.log('calculateSlope: previousMeanSlopeAmp', previousMeanSlopeAmp);
  // console.log('calculateSlope: slopeChangeRate', slopeChangeRate);
  // console.log('calculateSlope: previousPeakAmp', previousPeakAmp);
  // console.log('calculateSlope: standardDeviation', standardDeviation);
  // console.log('calculateSlope: samplingFrequency', samplingFrequency);
  return (
    previousMeanSlopeAmp +
    (slopeChangeRate *
      ((previousPeakAmp + standardDeviation) / samplingFrequency))
  );
}

function isSlopeMatchWithPPGMod(
  dataArr,
  slopeValue,
  slopeIndex,
  standardDeviation
) {
  // Example closer to ADT original
  // if (Math.abs(slopeValue - dataArr[slopeIndex]) <= standardDeviation * 0.1) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  // Working example for weights > 1.2
  // if (slopeValue >= dataArr[slopeIndex]) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  // Working example for weights < 1.2
  // if (
  //   slopeValue + standardDeviation * 0.1 >= dataArr[slopeIndex]
  // ) {
  //   // console.log("Is match?", true);
  //   return true;
  // } else {
  //   // console.log('Is match index', slopeIndex);
  //   // console.log('Is match?', dataArr[slopeIndex], slopeValue);
  //   return false;
  // }
  //Test
  if (
    slopeValue + standardDeviation * 0.1 >= dataArr[slopeIndex]
    // slopeValue - standardDeviation * 0.1 <= dataArr[slopeIndex]
  ) {
    // console.log("Is match?", true);
    return true;
  } else {
    // console.log('Is match index', slopeIndex);
    // console.log('Is match?', dataArr[slopeIndex], slopeValue);
    return false;
  }
}

function isCorrectPeakMod(peakIndex, refractoryPeriod) {
  if (peakIndex > refractoryPeriod.min && peakIndex < refractoryPeriod.max) {
    // console.log("isCorrectPeak: true", peakIndex);
    return true;
  } else {
    // console.log("isCorrectPeak: false", peakIndex);
    // console.log("isCorrectPeak: refractoryPeriod.min", refractoryPeriod.min);
    // console.log("isCorrectPeak: refractoryPeriod.max", refractoryPeriod.max);
    return false;
  }
  // if (peakIndex > refractoryPeriod.min && peakIndex < refractoryPeriod.max) {
  //   console.log("isCorrectPeak: false", peakIndex);
  //   return false;
  // } else {
  //   console.log("isCorrectPeak: true", peakIndex);
  //   return true;
  // }
  // Alternative
  // if (Math.abs(
  //   peakIndex - previousPeakIndex
  // ) < refractoryPeriod.min || Math.abs(
  //   peakIndex - previousPeakIndex
  // ) > refractoryPeriod.max) {
  //   console.log('isCorrectPeak: false', peakIndex);
  //   return false;
  // } else {
  //   console.log('isCorrectPeak: true', peakIndex);
  //   return true;
  // }
}
