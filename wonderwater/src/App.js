import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { decode } from "jsonwebtoken";
import axios from 'axios';
import Register from './user/Register';
import Login from './user/Login';
import Home from './Home';
import AddWaterBody from './waterbodies/AddWaterBody';
import WaterBodiesIndex from './waterbodies/WaterBodiesIndex';
import EditWaterBody from './waterbodies/EditWaterBody';

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      user: null,
      userData: null,
      message: null,
      messageType: null,
      redirect: null,
      editWaterBody: null
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
            if (response.data != null) {
              userDataTemp = { ...response.data };
              console.log("user data is")
              console.log(userDataTemp)
              this.setState({
                userData: { ...userDataTemp }
              })
            }
          }).catch(error => {
            console.log(error);
          })

          this.setState({
            isAuth: true,
            user: user,
            message: "Successfully loged in!",
            messageType: "success",
            redirect: "/"
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

  addWaterBodyHandler = (waterBody) => {
    axios.post("/wonderwater/waterbody/add", waterBody, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  editWaterBodyHandler = (waterBody) => {
    axios.put("/wonderwater/waterbody/edit", waterBody, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  editListener = (waterBody) => {
    this.setState({
      editWaterBody: waterBody,
      redirect: "/waterbody/edit"
    })
  }

  render() {
    return (
      <div>
        <Router>
          {this.state.redirect ? <Redirect to={this.state.redirect} /> : null}
          {this.state.isAuth ? (
            <div>
              <Link to="/">Home</Link>{' '}
              <Link to="/waterbody/add">Add Water Body</Link>{' '}
              <Link to="/waterbody/index">Water Bodies</Link>{' '}
              <Link to="/logout" onClick={this.logoutHandler}>Logout</Link>

              <Route exact path="/" component={Home} />
              <Route path="/waterbody/add" component={() => <AddWaterBody user={this.state.userData} addWaterBodyHandler={this.addWaterBodyHandler} />} />
              <Route path="/waterbody/edit" component={() => <EditWaterBody user={this.state.userData} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />} />
              <Route path="/waterbody/index" component={() => <WaterBodiesIndex editListener={this.editListener} isAuth={this.state.isAuth} userData={this.state.userData} />} />
            </div>
          ) : (
              <div>
                <Link to="/">Home</Link>{' '}
                <Link to="/waterbody/index">Water Bodies</Link>{' '}
                <Link to="/register">Register</Link>{' '}
                <Link to="/login">Login</Link>

                <Route exact path="/" component={Home} />
                <Route path="/waterbody/index" component={() => <WaterBodiesIndex isAuth={this.state.isAuth} userData={this.state.userData} />} />
                <Route path="/register" component={() => <Register registerHandler={this.registerHandler} />} />
                <Route path="/login" component={() => <Login loginHandler={this.loginHandler} />} />
              </div>
            )}
        </Router>
      </div>
    )
  }
}
