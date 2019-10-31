import { calculateStandardDeviation } from './signalParameters';

export const calculateWeightedPeaksBPM = (dataArr, frameRate, averageAmplitudeVarianceArr) => {
  // Based on: https://pdfs.semanticscholar.org/1d60/4572ec6ed77bd07fbb4e9fc32ab5271adedb.pdf

  let weight = 1.2; // typically 1 <= h <= 3

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
      amplitudeDifferencePercentage += Math.abs(((dataArr[i] - averageAmplitudeVarianceArr[i]) / averageAmplitude) * 100);
    }
    const averageAmplitudeDifference = amplitudeDifferencePercentage / dataArr.length;
    console.log("averageAmplitudeDifference(in %):", averageAmplitudeDifference);
    if (averageAmplitudeDifference > 0) {
      weight = averageAmplitudeDifference < 1 ? 0.7 : averageAmplitudeDifference > 1.5 ? 1.2 : 1.1;
      console.log('Adjusted weight:', weight);
      for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i] - averageAmplitudeVarianceArr[i] > weight * standardDeviation) {
          peaksArray.push({
            index: i,
            value: dataArr[i]
          });
        }
      }
    } else {
      for (let i = 0; i < dataArr.length; i++) {
        if (dataArr[i] - averageAmplitudeVarianceArr[i] > weight * standardDeviation) {
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
  // console.log(periodsBetweenPeaks);
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

export const calculateADT = (dataArr, frameRate) => {
  const refractoryPeriod = 10; // Frames
  // const slopeChangeRate = {
  //   vMax: -0.6,
  //   vMin: 0.6
  // };
  const slopeChangeRate = {
    vMax: -0.9,
    vMin: 0.9
  };
  const averageAmplitude =
    dataArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    ) / dataArr.length;

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

  console.log('Initial values:');
  console.log('averageAmplitude:', averageAmplitude);
  console.log('PPGMax:', PPGMax);
  console.log('PPGMin:', PPGMin);
  console.log('vMaxSlopeInit:', vMaxSlopeInit);
  console.log('vMinSlopeInit:', vMinSlopeInit);
  console.log('standardDeviation:', standardDeviation);

  // Calculation data holders
  let slopeValue = 0;
  let slopeValues = [];
  let followPPG = false;
  let peaks = [];

  let averagePulseInterval = 0; // Frames

  for (var i = 0; i < dataArr.length; i++) {
    if (i === 0) {
      console.log('Initial step');
      slopeValue = calculateSlope(vMinSlopeInit, slopeChangeRate.vMin, 0, standardDeviation, frameRate);
      slopeValues.push(slopeValue);
      followPPG = isSlopeMatchWithPPG(dataArr, slopeValue, i, standardDeviation);
    } else {
      // console.log('Another step index:', i);
      if (followPPG) {
        console.log('followPPG "true"', i, slopeValue);
        if (dataArr[i] > dataArr[i + 1]) {
          console.log('PEAK DETECTED:', dataArr[i] > dataArr[i + 1], dataArr[i], dataArr[i + 1]);
          if (peaks.length > 0) {
            if (isCorrectPeak(i, { min: peaks[peaks.length - 1].index, max: peaks[peaks.length - 1].index + refractoryPeriod})) {
              peaks.push({
                index: i,
                value: dataArr[i]
              });
              followPPG = false;
              slopeValues.push(dataArr[i]);
              console.log('bol:', i);
            } else {
              console.log('rol:', i);
              slopeValues.push(dataArr[i]);
            }
          } else {
            console.log('vol:', i);
            peaks.push({
              index: i,
              value: dataArr[i]
            });
            followPPG = false;
            slopeValues.push(dataArr[i]);
          }
        } else {
          console.log('lol:', i);
          slopeValues.push(dataArr[i]);
        }
      } else {
        console.log('followPPG "false"', i, slopeValue);
        slopeValue = calculateSlope(slopeValues[i - 1], slopeChangeRate.vMin, peaks.length > 0 ? peaks[peaks.length - 1].value : 0, standardDeviation, frameRate);
        slopeValues.push(slopeValue);
        followPPG = isSlopeMatchWithPPG(dataArr, slopeValue, i, standardDeviation);
      }
    }
  }

  console.log('PEAKS:', peaks);

  return {
    slopeValues: slopeValues,
    peaks: peaks
  };
}


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
    slopeChangeRate *
      ((previousPeakAmp + standardDeviation) / samplingFrequency)
  );
}

function isSlopeMatchWithPPG(dataArr, slopeValue, slopeIndex, standardDeviation) {
  if (slopeValue + standardDeviation * 0.1 >= dataArr[slopeIndex]) {
    console.log('Is match?', true);
    return true;
  } else {
    // console.log('Is match index', slopeIndex);
    // console.log('Is match?', dataArr[slopeIndex], slopeValue);
    return false;
  }
}

function isCorrectPeak(peakIndex, refractoryPeriod) {
  if (peakIndex > refractoryPeriod.min && peakIndex < refractoryPeriod.max) {
    console.log('isCorrectPeak: false', peakIndex);
    return false;
  } else {
    console.log('isCorrectPeak: true', peakIndex);
    return true;
  }
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
