import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactDom from 'react-dom';
import Points from './Points'
import XYAxis from './XYAxis';
import Tooltip from './Tooltip';



const xMax = (data) => {return (d3.max(data, (d)=>d['studyHoursPerWeek']));}
const yMax = (data) => {return (d3.max(data, (d)=>d['avgGPAReceived']));}
const yMin = (data) => {return (d3.min(data, (d)=>d['avgGPAReceived']));}
const xScale = (props) => {
  return d3.scaleLinear().domain([0, Math.ceil(xMax(props.capeData))]).range([props.padding, props.width - props.padding]);
}
const yScale = (props) => {
  return d3.scaleLinear().domain([Math.floor(yMin(props.capeData)), Math.ceil(yMax(props.capeData))]).range([props.height - props.padding, props.padding]);
}

const round = (num) => {
  return Math.round(num*100)/100;
}

const tooltipStyle = {
  opacity: 1,
  display: 'block',
  height: 25,
  margin: 0,
  position: 'absolute',
  top: '0',
  left: '0',
  fontSize: 12
}

export default class ScatterPlot extends Component {

  componentDidMount(){
    this.renderToolTips();
  }

  componentDidUpdate(){
    this.renderToolTips();
  }

  // TODO have D3JS render the tool tip
  renderToolTips(){
    var tooltip = ReactDom.findDOMNode(this.refs['tooltip']);
    var me      = this;
    d3.selectAll('circle').on('mouseover', function(d){
      var xPos          = d3.mouse(this)[0],
          yPos          = d3.mouse(this)[1],
          translate     = `translate(${xPos}, ${yPos})`,
          nodeSelection = d3.select(this).attr('title'),
          textNode      = document.createTextNode(nodeSelection),

          scaledTime    = d3.select(this).attr('cx'),
          scaledGPA     = d3.select(this).attr('cy'),
          avgTime       = round(xScale(me.props).invert(scaledTime)),
          avgGPA        = round(yScale(me.props).invert(scaledGPA)),
          coord         = '[ ' + avgTime + ' , ' + avgGPA + ' ]',
          coordNodeText = document.createTextNode(coord);

      tooltip.childNodes[0].textContent = nodeSelection;
      tooltip.style.opacity = 1;
      tooltip.setAttribute('transform', translate);
    }).on('mouseout', function(){
      tooltip.style.opacity = 0;
    })
  }

  render(){
    const scales = {xScale : xScale(this.props), yScale : yScale(this.props)}
    return (
      <div>
        <svg width={this.props.width} height={this.props.height}>
          <Points {...scales} {...this.props}/>
          <XYAxis {...this.props} {...scales}/>
          <Tooltip ref="tooltip" {...tooltipStyle}/>
        </svg>
      </div>)
  }
}