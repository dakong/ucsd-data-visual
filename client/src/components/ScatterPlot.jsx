import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactDom from 'react-dom';
import Points from './Points'
import XYAxis from './XYAxis';
import Tooltip from './Tooltip';

const svgStyle = {
  border: 'solid 1px black'
}

const xMax = (data) => {return (d3.max(data, (d)=>d['studyHoursPerWeek']));}
const xMin = (data) => {return (d3.min(data, (d)=>d['studyHoursPerWeek']));}
const yMax = (data) => {return (d3.max(data, (d)=>d['avgGPAReceived']));}
const yMin = (data) => {return (d3.min(data, (d)=>d['avgGPAReceived']));}


const xScale = (props) => {
  return d3.scaleLinear()
           .domain([Math.floor(xMin(props.capeData)), Math.ceil(xMax(props.capeData))])
           .range([-10, props.width - 15]);
}

const yScale = (props) => {
  return d3.scaleLinear()
           .domain([Math.floor(yMin(props.capeData)), Math.ceil(yMax(props.capeData))])
           .range([props.height - 10, 15]);
}

const roundTenth = (num) => {
  return Math.round(num*100)/100;
}

export default class ScatterPlot extends Component {

  componentDidMount(){
    this.renderToolTips();
    this.renderZoomable();

  }

  componentDidUpdate(){
    this.renderToolTips();
    this.renderZoomable();
  }

  renderZoomable(){
    d3.select('svg').call(this.zoom(this.props, this.rescale));
  }

  zoom = (props, rescale) => {
    return d3.zoom()
             .scaleExtent([1,10])
             .translateExtent([[-100, -100], [props.width + props.padding, props.height + props.padding]])
             .on("zoom", rescale);
  }

  rescale = () => {

    d3.select('g').attr('transform', d3.event.transform);

    var zoomLevel = d3.event.transform.k;
    var xyAxisRef = this.refs['xyAxis'];
    var xAxisNode = xyAxisRef.refs.xAxis.childNodes[0];
    var yAxisNode = xyAxisRef.refs.yAxis.childNodes[0];
    //var points    = ReactDom.findDOMNode(this.refs['points']).childNodes;

    var xAxis = d3.axisBottom()
                  .ticks(10)
                  .tickPadding(-30)
                  .scale(d3.event.transform.rescaleX(xScale(this.props)));

    var yAxis = d3.axisLeft()
                  .ticks(5)
                  .tickPadding(-30)
                  .scale(d3.event.transform.rescaleY(yScale(this.props)));

    //Need to scale the points before we transform the axis
    this.props.scaleTooltip(zoomLevel);
    this.renderToolTips();
    this.props.scalePoints(zoomLevel);
    d3.select(xAxisNode).call(xAxis);
    d3.select(yAxisNode).call(yAxis);

  }

  renderToolTips(){
    var tooltip = ReactDom.findDOMNode(this.refs['tooltip']);
    var me      = this;

    d3.selectAll('circle').on('mouseover', function(d){
      var xPos           = d3.mouse(this)[0],
          yPos           = d3.mouse(this)[1],
          translate      = `translate(${xPos}, ${yPos})`,
          nodeSelection  = d3.select(this).attr('title'),
          scaledTime     = d3.select(this).attr('cx'),
          scaledGPA      = d3.select(this).attr('cy'),
          enroll         = d3.select(this).attr('data-enroll'),
          avgTime        = roundTenth(xScale(me.props).invert(scaledTime)),
          avgGPA         = roundTenth(yScale(me.props).invert(scaledGPA)),
          coord          = '[ ' + avgTime + ' , ' + avgGPA + ' ]',
          enrolled       = 'Enrolled: ' + enroll;

      tooltip.childNodes[0].childNodes[0].textContent = nodeSelection;
      tooltip.childNodes[0].childNodes[1].textContent = coord;
      tooltip.childNodes[0].childNodes[2].textContent = enrolled;
      tooltip.style.opacity = 1;
      tooltip.setAttribute('transform', translate);

    }).on('mouseout', function(){
      tooltip.style.opacity = 0;
    })
  }

  render(){
    const scales = {xScale : xScale(this.props), yScale : yScale(this.props)}
    const tooltipStyle = {
      style:{
        pointerEvents: 'none',
        fontSize: this.props.tooltipSize
      },
      dy : {
        dy: "1.0em"
      }
    }

    return (
      <div>
        <svg width={this.props.width} height={this.props.height} style={svgStyle}>
          <g width={this.props.width} height={this.props.height}>
            <Points ref="points" {...scales} {...this.props}/>
            <Tooltip ref="tooltip" {...tooltipStyle}/>
          </g>
          <XYAxis ref="xyAxis" {...this.props} {...scales} />
        </svg>
      </div>)
  }
}
