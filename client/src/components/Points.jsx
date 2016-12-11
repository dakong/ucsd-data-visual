import React, { Component } from 'react';

const roundTenth = (num) => {
  return Math.round(num*100)/100;
}
const roundWhole = (num) => {
  return Math.round(num);
}
const renderCircles = (props) => {

  return (coords, index) => {
    const courseTitle    = coords['course'] === undefined ? coords['subject'] : coords['subject'] + ' ' +  coords['course'];
    const radius         = props.toggleSize ? coords['enroll']/props.circleRadius :  (props.radiusConstant*props.radiusConstant) / props.circleRadius;
    const xPos           = roundTenth(props.xScale(coords['studyHoursPerWeek']))
    const yPos           = roundTenth(props.yScale(coords['avgGPAReceived']))
    const enrollmentSize = roundWhole(coords['enroll']);

    const circleProps = {
      cx            : xPos,
      cy            : yPos,
      r             : roundTenth(radius),
      fill          : coords['color'],
      cursor        : 'pointer',
    };

    const textProps = {
      transform: `translate(${xPos}, ${yPos})`,
      fontSize: 12,
      opacity: 0,
      pointerEvents: 'none'
    };

    return <g key={index}> <circle {...circleProps}/>
      <text {...textProps}>
        <tspan dx="1.0em" x="0">{courseTitle}</tspan>
        <tspan dx="1.0em" x="0" dy="1.0em">{'[ ' + roundTenth(coords['avgGPAReceived']) + ' , ' + roundTenth(coords['studyHoursPerWeek']) + ' ]'}</tspan>
        <tspan dx="1.0em" x="0" dy="1.0em">{enrollmentSize}</tspan>
      </text>
    </g>;
  }
}
export default class Points extends Component {
  render(){
    return <g>{ this.props.capeData.map(renderCircles(this.props))} </g>
  }

}
