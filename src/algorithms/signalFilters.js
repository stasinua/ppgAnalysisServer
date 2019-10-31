export const calculateMovingAverage = (dataArr, returnResult, renderChart) => {
  const frameRateDelimeter = Math.round((dataArr.length / 10) / 6);
  var movingAverageArr = [];

  var movingAverage = (arr, startIndex) => {
    if (startIndex + frameRateDelimeter >= arr.length) {
      returnResult(dataArr, movingAverageArr);
      renderChart(
        movingAverageArr.map((elem, index) => {
          return { x: index, y: elem };
        })
      );
    } else {
      var sum = 0;
      for (var i = startIndex; i < startIndex + frameRateDelimeter; i++) {
        sum = sum + arr[i];
      }
      movingAverageArr.push((1 / frameRateDelimeter) * sum);
      movingAverage(arr, startIndex + frameRateDelimeter);
    }
  };

  movingAverage(dataArr, 0);
}

export const smoothArray = (dataArr, smoothing) => {
  let value = dataArr[0];
  let resultArr = dataArr.map((elem, index) => {
    value += (elem - value) / smoothing;
    return value;
  });

  return resultArr;
}

export const amplitudeNormalization = (dataArr) => {
  const meanAmplitudeVariance = smoothArray(dataArr, 20);

  let resultArr = dataArr.map((elem, index) => {
    return elem - meanAmplitudeVariance[index];
  });

  return resultArr;
}
