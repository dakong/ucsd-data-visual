import React, { Component } from 'react';

export default class Tooltip extends Component {
  render(){
    return(
      <g>
        <text style={{pointerEvents: 'none', fontSize: 12}}>
          <tspan dx="1.0em" x="0"></tspan>
          <tspan dx="1.0em" x="0" dy="1.2em"></tspan>
          <tspan dx="1.0em" x="0" dy="1.2em"></tspan>
        </text>
      </g>
    )
  }
}
