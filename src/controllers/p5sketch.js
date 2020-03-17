import * as p5 from 'p5/lib/addons/p5.sound';

export default function sketch (p) {
  let rotation = 0;

  p.setup = function () {
    p.createCanvas(600, 400, p.WEBGL);

    let filter = p5;
    console.log(filter);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  p.draw = function () {
    p.background(100);
    p.normalMaterial();
    p.noStroke();
    p.push();
    p.rotateY(rotation);
    p.box(100);
    p.pop();
  };
};
// import p5 from 'p5';
//
// const sketch = (p5) => {
//     var canvas;
//
//     // Set height and width of canvas
//     const canvasWidth = p5.windowWidth;
//     const canvasHeight = p5.windowHeight;
//
//     // make library globally available
//     window.p5 = p5;
//
//     // Setup function
//     p5.setup = () => {
//         let canvas = p5.createCanvas(canvasWidth, canvasHeight);
//         // canvas.parent('sketch');
//         p5.background(255, 255, 255);
//     }
//
//     // Draw function
//     p5.draw = () => {
//         // ...
//     }
//
//     // Test function, accesible from outside
//     p5.test = PPGData => {
//         console.log("testing -->");
//         // const filter = new p5.BandPass();
//         const fft = new p5.FFT();
//
//         let spectrum = fft.analyze(PPGData);
//         console.log(spectrum);
//     }
// }
// export default sketch;
