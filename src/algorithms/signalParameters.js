import FFT from 'fft.js';
import * as DSP from 'dsp.js';

export const arrayAverage = (dataArr, accessParam) => {
  if (accessParam) {
    return (
      dataArr.reduce((accumulator, currentValue) => {
        return accumulator + currentValue[accessParam];
      }, 0) / dataArr.length
    );
  } else {
    return (
      dataArr.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      ) / dataArr.length
    );
  }
};

export const calculateStandardDeviation = (dataArr, averageAmplitude) => {
  let sd = 0;
  for (var i = 0; i < dataArr.length; i++) {
    sd += Math.pow(dataArr[i] - averageAmplitude, 2) / dataArr.length;
  }

  return Math.sqrt(sd);
};

export const calculateAutocorrelation = dataArr => {
  const averageAmplitude = arrayAverage(dataArr);

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
};

export const calculateFFT = dataArr => {
  // Example with fft.js
  const f = new FFT(256);

  const input = new Array(256);
  for (var i = 0; i < input.length; i++) {
    input[i] = dataArr[i];
  }
  // console.log(input);

  let out = f.createComplexArray();
  // console.log(out);

  const data = f.toComplexArray(input);
  // console.log(data);

  // Use only to obtain fft directly from input
  // f.realTransform(out, input);
  f.transform(out, data)

  // console.log(f);
  // console.log(out);

  const outFrequencyData = out.slice().filter((elem, index) => {
    return (index < out.length / 2) && index !== 0;
    // Removing indexes from 255 and excluding first element because they dont have frequency-dependent information
  });
  //
  // const descSortedDataArr = outFrequencyData.slice().sort((a, b) => {
  //   return b - a;
  // });
  // // console.log('descSortedDataArr', descSortedDataArr);
  // console.log(outFrequencyData.indexOf(descSortedDataArr[0]));
  // console.log(outFrequencyData.lastIndexOf(descSortedDataArr[0]));
  //
  // // FFT to frequency formula: (bin_id * freq/2) / (N/2)
  // const mainFrequency = (outFrequencyData.indexOf(descSortedDataArr[0]) * 30/2) / (input.length/2);
  // console.log('mainFrequency:', mainFrequency);

  //Constructing filtered signal
  let dataifft = data.slice()
  .map((elem, index) => {
    if (index > 30 && index < data.length - 30) {
      return 0;
    } else {
      return elem;
    }
  });
  let ifftOut = out.slice()
  .map((elem, index) => {
    if (index > 30 && index < out.length - 30) {
      return 0;
    } else {
      return elem;
    }
  });
  f.inverseTransform(ifftOut, dataifft);
  // console.log(dataifft, ifftOut);

  return {
    ifftOut,
    outFrequencyData
  };
  // Example with DSP.js. Gives good FFT data
  // const input = new Array(256);
  // for (var i = 0; i < input.length; i++) {
  //   input[i] = dataArr[i];
  // }
  //
  // let dft = new DSP.FFT(256, 30);
  //
  // dft.forward(input);
  //
  // let spectrum = new Array(...dft.spectrum);
  //
  // let outFrequencyData = spectrum.slice().filter((elem, index) => {
  //   return index !== 0;
  // });
  // console.log(outFrequencyData);
  //
  // return {
  //   outFrequencyData
  // }
}
