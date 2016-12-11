import React, { Component } from 'react';
import * as d3 from 'd3';
import Points from './Points'
import XYAxis from './XYAxis';

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
    d3.selectAll('circle').on('mouseover', function(d){
      this.nextElementSibling.style.opacity = 1;
    }).on('mouseout', function(){
      this.nextElementSibling.style.opacity = 0;
    })
  }

  render(){
    const scales = {xScale : xScale(this.props), yScale : yScale(this.props)}

    return (
      <div>
        <svg width={this.props.width} height={this.props.height} style={svgStyle}>
          <g width={this.props.width} height={this.props.height}>
            <Points {...scales} {...this.props}/>
          </g>
          <XYAxis ref="xyAxis" {...this.props} {...scales} />
        </svg>
      </div>)
  }
}
