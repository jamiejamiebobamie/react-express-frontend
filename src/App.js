/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable semi */
import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    // State holds values returned from server
    this.state = {
      about: null,
      message: null,
      die: 4,
      sides: 6,
      info: '',
      zip: null,
    }
    this.handleChangeSides = this.handleChangeSides.bind(this);
    this.handleChangeDie = this.handleChangeDie.bind(this);
    this.handleChangeZip = this.handleChangeZip.bind(this);
  }

  componentDidMount() {
    // Use Fetch to call API. The /test route returns a simple string
    // This call in componentDidMount will only be called once
    fetch('/about').then((res) => {
      // stream the response as JSON
      return res.json()
    }).then((json) => {
      console.log(json)
      const { about } = json // Get a value from JSON object
      this.setState({ about }) // Set a value on state with returned value
    }).catch((err) => {
      // Handle errors
      console.log(err.message)
    })

    // Let's call another API
    this.fetchMessage()
  }

  handleChangeDie(event) {
    this.setState({ die: event.target.value });
  }

  handleChangeSides(event) {
    this.setState({ sides: event.target.value });
  }

  handleChangeZip(event) {
    this.setState({ zip: event.target.value });
  }

  fetchMessage() {
    // Wrapping the API call in a function allow you to make calls to this
    // API as often as needed.
    // This calls a route and passes value in the query string.

    let { die, sides } = this.state

    die = parseInt(die, 10)
    sides = parseInt(sides, 10)


    console.log(this.state)

    // if (die < 1){
    //     this.setState({die:1})
    // }
    // if (sides < 0){
    //     this.setState({sides:6})
    // }

    const fetchUrl = `/random/dice/${die}/${sides}`;

    fetch(fetchUrl).then(res => res.json()).then((json) => {
      console.log('>', json)
      this.setState({
        message: json.rolls,
      })
    }).catch((err) => {
      console.log(err.message)
    })
  }

  fetchInfo() {
    // Wrapping the API call in a function allow you to make calls to this
    // API as often as needed.
    // This calls a route and passes value in the query string.

    const { zip } = this.state

    console.log(zip)

    const fetchUrl = `/weather/${zip}`;

    fetch(fetchUrl).then(res => res.json()).then((json) => {
      console.log('>', json)
      if (json.info){
          this.setState({ info: json.info.city.name })
      }
    }).catch((err) => {
      console.log(err.message)
    })
  }


  renderInfo() {
    // Used to conditionally render data from server.
    // Returns null if message is null otherwise returns
    // a populated JSX element.
    const { info } = this.state
    if (info === null || info === '') {
      return undefined
    }

    return <div>{info}</div>
  }

  renderMessage() {
    // Used to conditionally render data from server.
    // Returns null if message is null otherwise returns
    // a populated JSX element.
    const { message } = this.state
    if (message === null) {
      return undefined
    }
    console.log(message)

    const display = message.map(num => <h1>{num}</h1>)

    return <div>{display}</div>
  }

  render() {
    const { about } = this.state

    return (
      <div className="App">
        <div>
          <p>
            <strong>About:</strong>
            {about}
          </p>
          <form className="inputFields">

            <label>
              # of Die:
              <input type="text" name="Die" value={this.state.die} onChange={this.handleChangeDie} />
            </label>

            <label>
              # of Sides:
              <input type="text" name="Sides" value={this.state.sides} onChange={this.handleChangeSides} />
            </label>
          </form>

          <button
            className="submitButton"
            type="submit"
            value="Submit"
            onClick={() => {
              this.fetchMessage()
            }}
          >Submit</button>
        </div>

        <div>

        <div className="output">{this.renderInfo()}</div>

          <form className="inputFields">

            <label>
            Enter a zip code:
            <input type="text" name="info" value={this.state.zip} onChange={this.handleChangeZip} />
            </label>
          </form>

          <button
            className="submitButton"
            type="submit"
            value="Submit"
            onClick={() => {
              this.fetchInfo()
            }}
          >Submit</button>
        </div>

        <div className="output">{this.renderMessage()}</div>

      </div>
    );
  }
}

export default App;
