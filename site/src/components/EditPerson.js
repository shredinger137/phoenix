import React from "react";
import { Link } from "react-router-dom";
import '../css/menu.css';

export default class EditPerson extends React.Component {


  componentDidUpdate() {

  }

  componentDidMount() {
  }

  captureAndIgnoreClick(e){
    e.preventDefault();
    e.stopPropagation();
  }



  render() {
    return (
      <>
        <div id="outerModal" onClick={() => this.props.closeModal()}>
          <div id="innerModal" onClick={(e) => this.captureAndIgnoreClick(e)}>
            <h1>ID: {this.props.id}</h1>
          </div>
        </div>

      </>
    );
  }
}
