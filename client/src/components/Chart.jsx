import React, { Component } from 'react';
import ScatterPlot from './ScatterPlot';
import Footer from './Footer';
import Query from '../API/SearchApi';
import '../css/ScatterPlot.css';

const numDataPoints = 25;
const styles = {
  width: 750,
  height: 500,
  padding: 50
}
const randomHue = () => 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) +',.6)';

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
    this.overView();
  }

  render() {
    const chart = this.state.capeData !== null ? ( <ScatterPlot {...this.state} {...styles}/>) : null;
    const dropDownOptions = this.state.dropDownOptions.map((courses, index) => (
      <option value={courses} key={index}>{courses}</option>
    ));
    return (<div id="page-container">
      <div id="chart-container">
        <h1 id="chart-title"> Results for {this.state.currentSubject} </h1>
          <div className='control'>
            <label><input type="checkbox" onChange={(event)=>this.toggleSize(event)} checked={this.state.toggleSize}/>&nbsp;Show enrollment size</label><br />
            <select onChange={(event)=>this.selectSubject(event)}>
              <option value="all" key ="0">All Subjects</option>
              {dropDownOptions}
            </select> <br />
          </div>
        {chart}
      </div>
      <Footer />
    </div>)
  }
}
