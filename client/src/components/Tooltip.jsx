import React, { Component } from 'react';

export default class Tooltip extends Component {
  render(){
    return(
      <g>
        <text style={this.props.style}>
          <tspan dx="1.0em" x="0"></tspan>
          <tspan dx="1.0em" x="0" dy={this.props.dy.dy}></tspan>
          <tspan dx="1.0em" x="0" dy={this.props.dy.dy}></tspan>
        </text>
      </g>
    )
  }
}
