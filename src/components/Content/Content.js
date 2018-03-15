import React, { Component } from 'react';

import './Content.css';

class Content extends Component {
  render() {
    return (
      <main className="App-content container">
        {this.props.children}
      </main>
    );
  }
}

export default Content;