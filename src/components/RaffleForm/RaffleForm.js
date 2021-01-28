import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
//Material UI imports
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  Box,
} from '@material-ui/core';

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

  handleInputChange = (propName) => (event) => {
    this.setState({
      [propName]: event.target.value,
    });
  };

  render() {
    return (
      <Container>
        <Grid container justify="center">
          <Grid item>
            <form className="opacity" onSubmit={this.handleNextClick}>
              <Typography variant="h4" component="h2" gutterBottom>
                Registration
              </Typography>
              {this.props.store.errors.registrationMessage && (
                <h3 className="alert" role="alert">
                  {this.props.store.errors.registrationMessage}
                </h3>
              )}
              <Typography variant="h6" component="h3" gutterBottom>
                Personal Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6}>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="first name"
                        type="text"
                        name="firstName"
                        value={this.state.firsName}
                        // required
                        variant="outlined"
                        onChange={this.handleInputChange('firstName')}
                      />
                    </div>
                  </Box>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="middle name/initial"
                        type="text"
                        name="middleName"
                        value={this.state.middleName}
                        // required
                        variant="outlined"
                        onChange={this.handleInputChange('middleName')}
                      />
                    </div>
                  </Box>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="last name"
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        // required
                        variant="outlined"
                        onChange={this.handleInputChange('lastName')}
                      />
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        variant="outlined"
                        onChange={this.handleInputChange('email')}
                      />
                    </div>
                  </Box>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="phone number"
                        // type="number"
                        name="phone_number"
                        value={this.state.phoneNumber}
                        variant="outlined"
                        onChange={this.handleInputChange('phoneNumber')}
                      />
                    </div>
                  </Box>
                  <Box mb={2}>
                    <div>
                      <TextField
                        style={{ backgroundColor: 'white' }}
                        fullWidth
                        size="small"
                        placeholder="zipcode"
                        type="number"
                        name="zip_code"
                        value={this.state.zipCode}
                        variant="outlined"
                        onChange={this.handleInputChange('zipCode')}
                      />
                    </div>
                  </Box>
                </Grid>
              </Grid>
              <div>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  // name="submit"
                  // value="Register"
                >
                  Next
                </Button>
              </div>
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default connect(mapStoreToProps)(RaffleForm);
