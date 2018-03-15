import React, { Component } from 'react';
import {BrowserRouter as Router, Link, Route, Redirect} from 'react-router-dom'
import {
  Col,
  Grid,
  Row,
  PageHeader
} from 'react-bootstrap'

import Cats from './pages/Cats'
import NewCat from './pages/NewCat'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      apiUrl: "http://localhost:3000",  // <-- Added this line
      cats: [],
      newCatSuccess: false,
      errors: null
    }
  }

  componentWillMount(){
    fetch(`${this.state.apiUrl}/cats`)
    .then((rawResponse) =>{
      return rawResponse.json()
    })
    .then((parsedResponse)=>{
      this.setState({cats: parsedResponse})
    })
  }

  newCatSubmit(cat){
    fetch(`${this.state.apiUrl}/cats`,
      {
        body: JSON.stringify(cat),  // <- we need to stringify the json for fetch
        headers: {  // <- We specify that we're sending JSON, and expect JSON back
          'Content-Type': 'application/json'
        },
        method: "POST"  // <- Here's our verb, so the correct endpoint is invoked on the server
      }
    )
    .then((rawResponse)=>{
      // rawResponse.json() itself returns another promise, we we need to resolve it before continuingg
      return Promise.all([rawResponse.status, rawResponse.json()])
    })
    .then((parsedResponse) =>{
      if(parsedResponse[0] === 422){ // <- Check for any server side errors
        this.setState({errors: parsedResponse[1]})
      }else{
        const cats = Object.assign([], this.state.cats)
        cats.push(parsedResponse[1]) // <- Add the new cat to our list of cats
        this.setState({
          cats: cats,  // <- Update cats in state
          errors: null, // <- Clear out any errors if they exist
          newCatSuccess: true // <- This is the new flag in state
        })
      }
    })
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={props => (
            <Grid>
              <PageHeader>
                <Row>
                  <Col xs={8}>
                    Cat Tinder
                    <small className='subtitle'>Add a Cat</small>
                  </Col>
                </Row>
              </PageHeader>
              <NewCat 
                onSubmit={this.newCatSubmit.bind(this)}
                errors={this.state.errors}
              />

              {this.state.newCatSuccess &&
                <Redirect to="/cats" />
              }
            </Grid>
          )} />


          <Route exact path="/cats" render={props => (
            <Grid>
              <PageHeader>
                <Row>
                  <Col xs={8}>
                    Cat Tinder
                    <small className='subtitle'>All the Cats</small>
                  </Col>
                </Row>
              </PageHeader>
              <Cats cats={this.state.cats} />
              {!this.state.newCatSuccess &&
                <Redirect to="/" />
              }
            </Grid>
          )} />
        </div>
      </Router>
    )
  }
}

export default App;

