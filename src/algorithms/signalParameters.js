export const calculateStandardDeviation = (dataArr, averageAmplitude) => {
  let sd = 0;
  for (var i = 0; i < dataArr.length; i++) {
    sd += Math.pow(dataArr[i] - averageAmplitude, 2) / dataArr.length;
  }

  return Math.sqrt(sd);
}

export const calculateAutocorrelation = (dataArr) => {
  const averageAmplitude =
    dataArr.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    ) / dataArr.length;

  // const standardDeviation = calculateStandardDeviation(
  //   dataArr,
  //   averageAmplitude
  // );

  let autocorrelation = [];
  const autocorrelationBase = dataArr.length / 2;
  let numerator = 0;
  let denominator = 0;
  let meanVariance = 0;

  for (var t = 0; t < autocorrelationBase; t++) {
    for (var i = 0; i < dataArr.length; i++) {
      meanVariance = dataArr[i] - averageAmplitude;

      numerator +=
        meanVariance * (dataArr[(i + t) % dataArr.length] - averageAmplitude);
      denominator += meanVariance * meanVariance;
    }

    autocorrelation.push(numerator / denominator);
  }

  return autocorrelation;
}
