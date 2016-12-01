import React, { Component } from 'react';

const renderCircles = (props) => {
  return (coords, index) => {
    const courseTitle = coords['course'] === undefined ? coords['subject'] : coords['subject'] + ' ' +  coords['course'];
    const circleProps = {
      cx     : props.xScale(coords['studyHoursPerWeek']),
      cy     : props.yScale(coords['avgGPAReceived']),
      r      : coords['enroll'] / 8,
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
