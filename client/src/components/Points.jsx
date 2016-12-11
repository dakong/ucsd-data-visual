import React, { Component } from 'react';

const roundTenth = (num) => {
  return Math.round(num*100)/100;
}
const roundWhole = (num) => {
  return Math.round(num);
}
const renderCircles = (props) => {

  return (coords, index) => {

    const courseTitle = coords['course'] === undefined ? coords['subject'] : coords['subject'] + ' ' +  coords['course'];
    const radius = props.toggleSize ? coords['enroll']/props.circleRadius :  (props.radiusConstant*props.radiusConstant) / props.circleRadius;

    const circleProps = {
      cx            : roundTenth(props.xScale(coords['studyHoursPerWeek'])),
      cy            : roundTenth(props.yScale(coords['avgGPAReceived'])),
      r             : roundTenth(radius),
      fill          : coords['color'],
      title         : courseTitle,
      cursor        : 'pointer',
      "data-enroll" : roundWhole(coords['enroll']),
      key           : index
    };
    return <circle {...circleProps} />;
  }
}
export default class Points extends Component {
  render(){
    return <g>{ this.props.capeData.map(renderCircles(this.props))} </g>
  }

}
