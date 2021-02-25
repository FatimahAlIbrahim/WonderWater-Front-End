import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, withRouter } from "react-router-dom";
import { decode } from "jsonwebtoken";
import axios from 'axios';
import Register from './user/Register';
import Login from './user/Login';
import Home from './Home';
import AddWaterBody from './waterbodies/AddWaterBody';
import WaterBodiesIndex from './waterbodies/WaterBodiesIndex';
import UserProfile from './user/UserProfile';


class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isAuth: false,
      user: null,
      userData: null,
      userWaterBodies: null,
      userBookmarks: null,
      message: null,
      messageType: null,
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
    axios.post("/wonderwater/user/registration", user)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  }

  loginHandler = (user) => {
    axios.post("/wonderwater/user/authentication", user)
      .then(response => {
        console.log(response);

        if (response.data.token != null) {
          localStorage.setItem("token", response.data.token);

          let user = decode(response.data.token);
          let userDataTemp = {};
          let userBookmarksTemp = [];
          let userWaterBodiesTemp = [];
          axios.get(`/wonderwater/user/userInfo?email=${user.sub}`).then(response => {
            console.log(response);
            if (response.data != null) {
              userDataTemp = { ...response.data };
              console.log("user data is")
              console.log(userDataTemp)
              this.setState({
                userData: { ...userDataTemp }
              })
              axios.get(`/wonderwater/waterbody/find?id=${userDataTemp.id}`).then(response => {
                console.log(response);
                userWaterBodiesTemp = response.data;
                this.setState({
                  userWaterBodies: userWaterBodiesTemp
                })
              }).catch(error => {
                console.log(error);
              })
              axios.get(`/wonderwater/bookmark/find?id=${userDataTemp.id}`).then(response => {
                console.log(response)
                userBookmarksTemp = response.data
                this.setState({
                  userBookmarks: userBookmarksTemp
                })
              }).catch(error => {
                console.log(error);
              })
            }
          }).catch(error => {
            console.log(error);
          })
          this.setState({
            isAuth: true,
            user: user,
            userData: { ...userDataTemp },
            userWaterBodies: userWaterBodiesTemp,
            userBookmarks: userBookmarksTemp,
            message: "Successfully loged in!",
            messageType: "success",
          })
          this.props.history.push("/");
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
      userData: null,
    })
    this.props.history.push("/login");
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

  render() {
    return (
      <div>
          {this.state.isAuth ? (
            <div>
              <Link to="/">Home</Link>{' '}
              <Link to="/waterbody/add">Add Water Body</Link>{' '}
              <Link to="/waterbody/index">Water Bodies</Link>{' '}
              <Link to="/user/profile">Welcome {this.state.userData.emailAddress} </Link>{' '}
              <Link to="/logout" onClick={this.logoutHandler}>Logout</Link>

              <Route exact path="/" component={Home} />
              <Route exact path="/waterbody/add" component={() => <AddWaterBody user={this.state.userData} addWaterBodyHandler={this.addWaterBodyHandler} />} />
              <Route exact path="/waterbody/index" component={() => <WaterBodiesIndex isAuth={this.state.isAuth} userData={this.state.userData} />} />
              <Route exact path="/user/profile" component={() => <UserProfile isAuth={this.state.isAuth} user={this.state.userData} waterBodies={this.state.userWaterBodies} bookmarks={this.state.userBookmarks}/>} />
            </div>
          ) : (
              <div>
                <Link to="/">Home</Link>{' '}
                <Link to="/waterbody/index">Water Bodies</Link>{' '}
                <Link to="/register">Register</Link>{' '}
                <Link to="/login">Login</Link>

                <Route exact path="/" component={Home} />
                <Route exact path="/waterbody/index" component={() => <WaterBodiesIndex isAuth={this.state.isAuth} userData={this.state.userData} />} />
                <Route exact path="/register" component={() => <Register registerHandler={this.registerHandler} />} />
                <Route exact path="/login" component={() => <Login loginHandler={this.loginHandler} />} />
              </div>
            )}
      </div>
    )
  }
} export default withRouter(App);
