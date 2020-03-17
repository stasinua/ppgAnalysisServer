import React, { Component } from 'react';
import Sketch from "react-p5";
import 'p5/lib/addons/p5.sound';

export default class FFTSpectrum extends Component {
    song;
    amp;
    loadedState = false;

  setup = p5 => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.angleMode(p5.DEGREES);
      // this.song =  p5.loadSound("song.mp3", this.loaded);
      console.log(p5);
      // this.amp = new p5.Amplitude();
  }

  loaded() {
    console.log('here3');
      this.loadedState = true;
  }

  keyPressed() {
      if(this.loadedState)
        this.togglePlaying();
  }

  togglePlaying() {
      if (!this.song.isPlaying()) {
          this.song.play();
      } else {
          this.song.pause();
      }
  }

  volHistory = [];

  draw = p5 => {
      p5.background(0);

      // let vol = this.amp.getLevel();
      // this.volHistory.push(vol);

      p5.stroke(255);
      p5.noFill();

      p5.translate(p5.width/2, p5.height/2);
      p5.beginShape();
      for(let i = 0; i < 360; i++) {
          let r = p5.map(this.volHistory[i], 0, 1, 50, 500);
          let x = r * p5.cos(i);
          let y = r * p5.sin(i);

          p5.vertex(x, y);
      }
      p5.endShape();

      if(this.volHistory.length > 360) {
        this.volHistory.splice(0, 1);
      }
  }

  render() {
      return <Sketch setup={this.setup} draw={this.draw}/>
  }
}
