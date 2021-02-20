import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import axios from 'axios';
import Register from './user/Register';
import Login from './user/Login';
import Home from './Home';

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      user: null,
      userData: null,
      message: null,
      messageType: null,
      redirect: null
    }
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    if (token != null) {
      let user = decode(token);
      let dateNow = new Date();
      let isExpired = false;

      if (user.exp < dateNow.getTime())
        isExpired = true;

      if (user && !isExpired) {
        this.setState({
          isAuth: true,
          user: user
        })
      }
      else if (!user || isExpired) {
        localStorage.removeItem("token");
        this.setState({
          isAuth: false
        })
      }
    }
  }

  registerHandler = (user) => {
    axios.post("wonderwater/user/registration", user)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  loginHandler = (user) => {
    axios.post("wonderwater/user/authentication", user)
      .then(response => {
        console.log(response);

        if (response.data.token != null) {
          localStorage.setItem("token", response.data.token);

          let user = decode(response.data.token);
          let userDataTemp = {};
          axios.get(`wonderwater/user/userInfo?email=${user.sub}`).then(response => {
            console.log(response);
            userDataTemp = response.data;
          }).catch(error => {
            console.log(error);
          })

          this.setState({
            isAuth: true,
            user: user,
            userData: userDataTemp,
            message: "Successfully loged in!",
            messageType: "success"
          })
        }
        else {
          this.setState({
            isAuth: false,
            user: user,
            message: "incorrect username or password",
            messageType: "danger"
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  logoutHandler = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    this.setState({
      isAuth: false,
      user: null,
      userData: null
    })
  }

  render() {
    return (
      <div>
        <Router>
          {this.state.isAuth ? (
            <div>
              <Link to="/">Home</Link>{' '}
              <Link to="/logout" onClick={this.logoutHandler}>Logout</Link>
            </div>
          ) : (
            <div>
              <Link to="/">Home</Link>{' '}
              <Link to="/register">Register</Link>{' '}
              <Link to="/login">Login</Link>
            </div>
          ) }

          <Route exact path="/" component={Home} />
          <Route path="/register" component={() => <Register registerHandler={this.registerHandler} />} />
          <Route path="/login" component={() => <Login loginHandler={this.loginHandler} />} />
        </Router>
      </div>
    )
  }
}
