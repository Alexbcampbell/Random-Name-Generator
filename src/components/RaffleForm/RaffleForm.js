import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';

// Basic class component structure for React with default state
// value setup. When making a new component be sure to replace
// the component name TemplateClass with the name for the new
// component.
class RaffleForm extends Component {
  state = {
    newEntry: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      zipCode: '',
    },
  };

  render() {
    return (
      <div>
        <h2>HELLO</h2>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(RaffleForm);
