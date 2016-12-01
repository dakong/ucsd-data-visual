import React, { Component } from 'react';

const circleRadius = 8;
const renderCircles = (props) => {
  return (coords, index) => {
    const courseTitle = coords['course'] === undefined ? coords['subject'] : coords['subject'] + ' ' +  coords['course'];
    const radius = props.toggleSize === 'on' ? coords['enroll']/circleRadius : circleRadius;
    const circleProps = {
      cx     : props.xScale(coords['studyHoursPerWeek']),
      cy     : props.yScale(coords['avgGPAReceived']),
      r      : radius,
      fill   : coords['color'],
      title  : courseTitle,
      cursor : 'pointer',
      key    : index
    };
    return <circle {...circleProps} />;
  }
}
export default class Points extends Component {
  render(){
    return <g>{ this.props.capeData.map(renderCircles(this.props))} </g>
  }

}
