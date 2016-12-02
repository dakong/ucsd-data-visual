import React, { Component } from 'react';
import ScatterPlot from './ScatterPlot';
import '../css/ScatterPlot.css';
import Query from '../API/SearchApi';

const numDataPoints = 25;
const styles = {
  width: 750,
  height: 500,
  padding: 50
}
const randomX = () => Math.round(10 * (Math.random() * 30))/10;
const randomY = () => Math.round(10 * (Math.random() * 4))/10;
const randomSize = () => 100 + Math.floor(Math.random() * 300);
const randomHue = () => 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) +',.6)';

//TODO Change to an array of objects, and make coordinates an array
const randomDataSet = () => {
  return Array.apply(null, {length: numDataPoints}).map(()=>[randomX(), randomY(), randomSize(), randomHue()]);
}

// const calculateStandardDeviation = (dataSet) => {
//   const dataSetLength = dataSet.length;
//   var mean = dataSet.reduce((a,b) => (a + b.enroll), 0);
//   var stdDev = Math.sqrt(dataSet.reduce((a,b) => (a + Math.sqrt(Math.abs(b.enroll - mean))),0)/dataSetLength);
//   return stdDev;
// }

export default class Chart extends Component {
  constructor(props){
    super(props);
    this.state = {
      capeData : null,
      dropDownOptions: [
      ],
      currentSubject: 'all subjects',
      toggleSize: true
    }
    this.searchSubject = this.searchSubject.bind(this);
    this.returnFromSearch = this.returnFromSearch.bind(this);
    this.selectSubject = this.selectSubject.bind(this);
    this.toggleSize = this.toggleSize.bind(this);
  }

  returnFromSearch (result){
    const resultWithRndmColor = result.map((entry) => {
      entry.color = randomHue();
      return entry;
    })
    this.setState({
      capeData: resultWithRndmColor
    })
  }

  searchSubject (subject){
    Query.search(subject, this.returnFromSearch)
  }

  selectSubject(event){
    const option = event.target.value;
    if(option != 'all'){
      this.searchSubject(event.target.value);
      this.setState({
        currentSubject: event.target.value
      });
    }
    else{
      this.overView();
    }
  }

  randomizeDataSet(){
    this.setState({
      data: randomDataSet()
    })
  }

  overView(){
    Query.searchAllSubjects(this.returnFromSearch);
    this.setState({
      currentSubject: 'all subjects'
    })
  }

  toggleSize(event){
    this.setState({
      toggleSize : event.target.checked
    });
  }

  componentDidMount(){
    Query.getSubjectList((result)=>{this.setState({dropDownOptions: result})});
    //Query.search(this.state.currentSubject, this.returnFromSearch);
    this.overView();
  }

  render() {
    const chart = this.state.capeData !== null ? ( <ScatterPlot {...this.state} {...styles}/>) : null;
    const dropDownOptions = this.state.dropDownOptions.map((courses, index) => (
      <option value={courses} key={index}>{courses}</option>
    ));

    return (<div id="chart-container">
        <h1 id="chart-title"> Results for {this.state.currentSubject} </h1>
          <div className='control'>
            <label><input type="checkbox" onChange={(event)=>this.toggleSize(event)} checked={this.state.toggleSize}/>&nbsp;Show enrollment size</label><br />
            <select onChange={(event)=>this.selectSubject(event)}>
              <option value="all" key ="0">All Subjects</option>
              {dropDownOptions}
            </select> <br />
          </div>
        {chart}
      </div>)
  }
}
