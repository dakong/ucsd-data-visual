import React, { Component } from 'react';

const roundTenth = (num) => {
  return Math.round(num*100)/100;
}
const roundWhole = (num) => {
  return Math.round(num);
}
// const tooltipStyle = {
//   opacity: 0,
//   pointerEvents: 'none'
// }
const renderCircles = (props) => {

  return (coords, index) => {

    const courseTitle = coords['course'] === undefined ? coords['subject'] : coords['subject'] + ' ' +  coords['course'];
    //const coordinateText = '[ ' + roundTenth(coords['studyHoursPerWeek'])  +  ' , ' + roundTenth(coords['avgGPAReceived']) + ' ]';
    const enrolledText = roundWhole(coords['enroll']);

    const radius = props.toggleSize ? coords['enroll']/props.circleRadius :  (props.radiusConstant*props.radiusConstant) / props.circleRadius;
    const xPos = roundTenth(props.xScale(coords['studyHoursPerWeek']));
    const yPos = roundTenth(props.yScale(coords['avgGPAReceived']));

    const showLabel = props.toggleLabel ? 1 : 0;

    const circleProps = {
      cx            : xPos,
      cy            : yPos,
      r             : roundTenth(radius),
      fill          : coords['color'],
      cursor        : 'pointer',
      title         : courseTitle,
      "data-enroll" : enrolledText
    };

    const textProps = {
      style: {
        fontSize : roundTenth(radius),
        opacity  : showLabel,
        cursor   : "pointer"
      },
      transform : `translate(${xPos - roundTenth(radius)}, ${yPos + roundTenth(radius)/2})`
    }

    return <g key={index}>
        <circle {...circleProps} />
        <text {...textProps}> {courseTitle} </text>
      </g>
  }
}

export default class Points extends Component {
  render(){
    return <g>{ this.props.capeData.map(renderCircles(this.props))} </g>
  }
  // <text transform={`translate(${xPos}, ${yPos})`} style={tooltipStyle}>
  //   <tspan dx="1.0em" x="0">{courseTitle}</tspan>
  //   <tspan dx="1.0em" x="0" dy="1.0em">{coordinateText}</tspan>
  //   <tspan dx="1.0em" x="0" dy="1.0em">{enrolledText}</tspan>
  // </text>

}
