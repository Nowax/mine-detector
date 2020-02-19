import React, { Component } from "react";
import { withAuthentication } from "../Session";
import styled from "styled-components";
import { keyframes } from "styled-components";
import UIFx from "uifx";
import beepSound from "./my-sounds/beep.mp3";
import equal from "fast-deep-equal";

const bell = new UIFx(beepSound);

class Indicator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      play: false,
      time: Date.now(),
      ranges: [
        {
          max: Number.POSITIVE_INFINITY,
          min: 11,
          animDuration: 3000,
          indicator: <Indicator1 duration="3000ms" />
        },
        {
          max: 9,
          min: 6,
          animDuration: 1200,
          indicator: <Indicator3 duration="1200ms" />
        },
        {
          max: 4,
          min: 0,
          animDuration: 500,
          indicator: <Indicator5 duration="500ms" />
        }
      ],
      indicator: <Indicator1 duration="3000ms" />
    };
  }

  componentDidMount() {
    this.setLocalInterval(3000);
  }

  componentDidUpdate() {
    console.log("Component did update");

    this.state.ranges.some((range) => {
      if (
        this.props.distance <= range.max &&
        this.props.distance > range.min &&
        !equal(this.state.indicator, range.indicator)
      ) {
        this.setLocalInterval(range.animDuration);
        bell.play(1.0);
        this.setState({
          indicator: range.indicator
        });
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setLocalInterval = (miliseconds) => {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.setState({
        time: Date.now()
      });
      bell.play(1.0);
      console.log("update time");
    }, miliseconds);
  };

  render() {
    return this.state.indicator;
  }
}

var pulse1 = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(54,111,120,.8);
      }
      40% {
        box-shadow: 0 0 0 100px rgba(54,111,120,0.0);
      }
      80% {
        box-shadow: 0 0 0 100px rgba(54,111,120,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(54,111,120,0);
      }
  `;

var pulse2 = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(56, 117, 126,.8);
      }
      40% {
        box-shadow: 0 0 0 100px rgba(56, 117, 126,0.0);
      }
      80% {
        box-shadow: 0 0 0 100px rgba(56, 117, 126,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(56, 117, 126,0);
      }
  `;

var pulse3 = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(87, 168, 181,.8);
      }
      40% {
        box-shadow: 0 0 0 100px rgba(87, 168, 181,0.0);
      }
      80% {
        box-shadow: 0 0 0 100px rgba(87, 168, 181,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(87, 168, 181,0);
      }
  `;

var pulse4 = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(169, 210, 217,.8);
      }
      40% {
        box-shadow: 0 0 0 100px rgba(169, 210, 217,0.0);
      }
      80% {
        box-shadow: 0 0 0 100px rgba(169, 210, 217,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(169, 210, 217,0);
      }
  `;

var pulse5 = keyframes`
      0% {
        box-shadow: 0 0 0 0 rgba(244, 249, 250,.8);
      }
      40% {
        box-shadow: 0 0 0 100px rgba(244, 249, 250,0.0);
      }
      80% {
        box-shadow: 0 0 0 100px rgba(244, 249, 250,0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(244, 249, 250,0);
      }
  `;

const Indicator1 = styled.div`
  width: 200px;
  height: 200px;
  border: 5px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#377079+0,2e5d64+17,23494f+33,00343c+67,002126+83,000e10+100 */
  background: rgb(55, 112, 121); /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    rgba(55, 112, 121, 1) 0%,
    rgba(46, 93, 100, 1) 17%,
    rgba(35, 73, 79, 1) 33%,
    rgba(0, 52, 60, 1) 67%,
    rgba(0, 33, 38, 1) 83%,
    rgba(0, 14, 16, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    rgba(55, 112, 121, 1) 0%,
    rgba(46, 93, 100, 1) 17%,
    rgba(35, 73, 79, 1) 33%,
    rgba(0, 52, 60, 1) 67%,
    rgba(0, 33, 38, 1) 83%,
    rgba(0, 14, 16, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    rgba(55, 112, 121, 1) 0%,
    rgba(46, 93, 100, 1) 17%,
    rgba(35, 73, 79, 1) 33%,
    rgba(0, 52, 60, 1) 67%,
    rgba(0, 33, 38, 1) 83%,
    rgba(0, 14, 16, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#377079', endColorstr='#000e10',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  border-radius: 50%;
  color: #ffff;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  font-family: verdana;
  text-transform: upperase;
  animation: ${pulse1} ${(props) => (props.duration ? props.duration : "1s")}
    infinite forwards;
`;

const Indicator2 = styled.div`
  width: 200px;
  height: 200px;
  border: 5px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#4894a0+0,42848e+17,38757e+33,007688+67,006676+83,005764+100 */
  background: rgb(72, 148, 160); /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    rgba(72, 148, 160, 1) 0%,
    rgba(66, 132, 142, 1) 17%,
    rgba(56, 117, 126, 1) 33%,
    rgba(0, 118, 136, 1) 67%,
    rgba(0, 102, 118, 1) 83%,
    rgba(0, 87, 100, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    rgba(72, 148, 160, 1) 0%,
    rgba(66, 132, 142, 1) 17%,
    rgba(56, 117, 126, 1) 33%,
    rgba(0, 118, 136, 1) 67%,
    rgba(0, 102, 118, 1) 83%,
    rgba(0, 87, 100, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    rgba(72, 148, 160, 1) 0%,
    rgba(66, 132, 142, 1) 17%,
    rgba(56, 117, 126, 1) 33%,
    rgba(0, 118, 136, 1) 67%,
    rgba(0, 102, 118, 1) 83%,
    rgba(0, 87, 100, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4894a0', endColorstr='#005764',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  border-radius: 50%;
  color: #ffff;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  font-family: verdana;
  text-transform: upperase;
  animation: ${pulse2} ${(props) => (props.duration ? props.duration : "1s")}
    infinite forwards;
`;

const Indicator3 = styled.div`
  width: 200px;
  height: 200px;
  border: 5px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#71b5bf+0,66adb8+17,57a8b5+33,00cbea+67,00bfdc+83,00b3ce+100 */
  background: rgb(113, 181, 191); /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    rgba(113, 181, 191, 1) 0%,
    rgba(102, 173, 184, 1) 17%,
    rgba(87, 168, 181, 1) 33%,
    rgba(0, 203, 234, 1) 67%,
    rgba(0, 191, 220, 1) 83%,
    rgba(0, 179, 206, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    rgba(113, 181, 191, 1) 0%,
    rgba(102, 173, 184, 1) 17%,
    rgba(87, 168, 181, 1) 33%,
    rgba(0, 203, 234, 1) 67%,
    rgba(0, 191, 220, 1) 83%,
    rgba(0, 179, 206, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    rgba(113, 181, 191, 1) 0%,
    rgba(102, 173, 184, 1) 17%,
    rgba(87, 168, 181, 1) 33%,
    rgba(0, 203, 234, 1) 67%,
    rgba(0, 191, 220, 1) 83%,
    rgba(0, 179, 206, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#71b5bf', endColorstr='#00b3ce',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  border-radius: 50%;
  color: #ffff;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  font-family: verdana;
  text-transform: upperase;
  animation: ${pulse3} ${(props) => (props.duration ? props.duration : "1s")}
    infinite forwards;
`;

const Indicator4 = styled.div`
  width: 200px;
  height: 200px;
  border: 5px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#b6d9de+0,b1d5db+17,a9d2d9+33,71ecff+67,6bebff+83,63eaff+100 */
  background: rgb(182, 217, 222); /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    rgba(182, 217, 222, 1) 0%,
    rgba(177, 213, 219, 1) 17%,
    rgba(169, 210, 217, 1) 33%,
    rgba(113, 236, 255, 1) 67%,
    rgba(107, 235, 255, 1) 83%,
    rgba(99, 234, 255, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    rgba(182, 217, 222, 1) 0%,
    rgba(177, 213, 219, 1) 17%,
    rgba(169, 210, 217, 1) 33%,
    rgba(113, 236, 255, 1) 67%,
    rgba(107, 235, 255, 1) 83%,
    rgba(99, 234, 255, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    rgba(182, 217, 222, 1) 0%,
    rgba(177, 213, 219, 1) 17%,
    rgba(169, 210, 217, 1) 33%,
    rgba(113, 236, 255, 1) 67%,
    rgba(107, 235, 255, 1) 83%,
    rgba(99, 234, 255, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b6d9de', endColorstr='#63eaff',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  border-radius: 50%;
  color: #ffff;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  font-family: verdana;
  text-transform: upperase;
  animation: ${pulse4} ${(props) => (props.duration ? props.duration : "1s")}
    infinite forwards;
`;

const Indicator5 = styled.div`
  width: 200px;
  height: 200px;
  border: 5px;
  /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#f5fafb+0,f4f9fa+17,f4f9fa+33,edfdff+67,ebfcff+83,ebfcff+100 */
  background: rgb(245, 250, 251); /* Old browsers */
  background: -moz-linear-gradient(
    -45deg,
    rgba(245, 250, 251, 1) 0%,
    rgba(244, 249, 250, 1) 17%,
    rgba(244, 249, 250, 1) 33%,
    rgba(237, 253, 255, 1) 67%,
    rgba(235, 252, 255, 1) 83%,
    rgba(235, 252, 255, 1) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    -45deg,
    rgba(245, 250, 251, 1) 0%,
    rgba(244, 249, 250, 1) 17%,
    rgba(244, 249, 250, 1) 33%,
    rgba(237, 253, 255, 1) 67%,
    rgba(235, 252, 255, 1) 83%,
    rgba(235, 252, 255, 1) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(
    135deg,
    rgba(245, 250, 251, 1) 0%,
    rgba(244, 249, 250, 1) 17%,
    rgba(244, 249, 250, 1) 33%,
    rgba(237, 253, 255, 1) 67%,
    rgba(235, 252, 255, 1) 83%,
    rgba(235, 252, 255, 1) 100%
  ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f5fafb', endColorstr='#ebfcff',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

  border-radius: 50%;
  color: #ffff;
  font-size: 20px;
  text-align: center;
  line-height: 100px;
  font-family: verdana;
  text-transform: upperase;
  animation: ${pulse5} ${(props) => (props.duration ? props.duration : "1s")}
    infinite forwards;
`;

export default withAuthentication(Indicator);
