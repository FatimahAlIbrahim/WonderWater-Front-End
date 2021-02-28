import React, { Component } from 'react'
import { Route, Link, withRouter } from "react-router-dom";
import { decode } from "jsonwebtoken";
import axios from 'axios';
import Register from './user/Register';
import Login from './user/Login';
import Home from './Home';
import AddWaterBody from './waterbodies/AddWaterBody';
import WaterBodiesIndex from './waterbodies/WaterBodiesIndex';
import UserProfile from './user/UserProfile';
import { Nav, Navbar, Alert } from 'react-bootstrap';
import './App.css'
import SearchWaterBodies from './waterbodies/SearchWaterBodies';
import WaterBody from './waterbodies/WaterBody';

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
      detailWaterBody: null,
      hideAlert: true
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
        this.handleAlert("Created an account successfully!","success");
        this.props.history.push("/login");
      })
      .catch(error => {
        this.handleAlert("An error occurred while creating an account. Please try again later","danger");
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

          // get the user details from the subject of the token
          axios.get(`/wonderwater/user/userInfo?email=${user.sub}`).then(response => {
            if (response.data != null) {
              userDataTemp = { ...response.data };
              this.setState({
                userData: { ...userDataTemp }
              })

              // get the waterbodies that the user added
              axios.get(`/wonderwater/waterbody/find?id=${userDataTemp.id}`).then(response => {
                userWaterBodiesTemp = response.data;
                this.setState({
                  userWaterBodies: userWaterBodiesTemp
                })
              }).catch(error => {
                this.handleAlert("An error occurred while getting your posts. Please try logging in again later","danger");
              })

              // get the user bookmarks
              axios.get(`/wonderwater/bookmark/find?id=${userDataTemp.id}`).then(response => {
                console.log(response)
                userBookmarksTemp = response.data
                this.setState({
                  userBookmarks: userBookmarksTemp
                })
              }).catch(error => {
                this.handleAlert("An error occurred while getting your bookmarks. Please try logging in again later","danger");
              })
            }
          }).catch(error => {
            this.handleAlert("An error occurred while getting your information. Please try logging in again later","danger");
          })
          this.setState({
            isAuth: true,
            user: user,
            userData: { ...userDataTemp },
            userWaterBodies: userWaterBodiesTemp,
            userBookmarks: userBookmarksTemp,
          })
          this.handleAlert("Successfully logged in!","success");
          this.props.history.push("/");
        }
        else {
          this.setState({
            isAuth: false,
            user: user,
          })
          this.handleAlert("incorrect username or password","danger");
        }
      })
      .catch(error => {
        this.handleAlert("An error occurred while logging in. Please try again later","danger");
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
    this.handleAlert("Successfully logged out!","success");
    this.props.history.push("/login");
  }

  addWaterBodyHandler = (waterBody) => {
    axios.post("/wonderwater/waterbody/add", waterBody, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(response => {
        this.handleAlert("Successfully added a water body out!","success");
        this.props.history.push("/waterbody/index");
      })
      .catch(error => {
        this.handleAlert("An error occurred while adding the water body. Please try again later","danger");
      })
  }

  detailWaterBodyChangeHandler = (waterBody) => {
    this.setState({
      detailWaterBody: waterBody
    })
    this.props.history.push("/waterbody/details");
  }

  handleAlert = (message, messageType) => {
    console.log(message + " " + messageType)
    this.setState({
      message: message,
      messageType: messageType,
      hideAlert: false
    })

    setTimeout(() => {
      this.setState({
        hideAlert: true
      });
    }, 5000);

  }

  render() {
    const showAlert = <Alert className={!this.state.hideAlert ? "fade-out" : null} variant={this.state.messageType}>{this.state.message}</Alert>;
    return (
      <div>
        {this.state.isAuth ? (
          <div>
            <Navbar collapseOnSelect expand="lg" className="colorBG" variant="dark">
              <Navbar.Brand as={Link} to="/">Wonder Water</Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link as={Link} to="/waterbody/add">Add Water Body</Nav.Link>
                  <Nav.Link as={Link} to="/waterbody/index">Water Bodies</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link as={Link} to="/user/profile">Welcome {this.state.userData.emailAddress}</Nav.Link>
                  <Nav.Link as={Link} to="/logout" onClick={this.logoutHandler}>Logout</Nav.Link>
                  <SearchWaterBodies isAuth={this.state.isAuth} userData={this.state.userData} detailWaterBodyChangeHandler={this.detailWaterBodyChangeHandler}/>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            {this.state.hideAlert ? null : showAlert}

            <Route exact path="/" component={Home} />
            <Route exact path="/waterbody/add" component={() => <AddWaterBody handleAlert={this.handleAlert} user={this.state.userData} addWaterBodyHandler={this.addWaterBodyHandler} />} />
            <Route exact path="/waterbody/index" component={() => <WaterBodiesIndex handleAlert={this.handleAlert} isAuth={this.state.isAuth} userData={this.state.userData} />} />
            <Route exact path="/user/profile" component={() => <UserProfile handleAlert={this.handleAlert} isAuth={this.state.isAuth} user={this.state.userData} waterBodies={this.state.userWaterBodies} bookmarks={this.state.userBookmarks} />} />
          </div>
        ) : (
            <div>
              <Navbar collapseOnSelect expand="lg" className="colorBG" variant="dark">
                <Navbar.Brand as={Link} to="/"><em><span className="fontSize">W</span>onder<span className="fontSize">W</span>ater</em></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/waterbody/index">Water Bodies</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <SearchWaterBodies isAuth={this.state.isAuth} userData={this.state.userData} detailWaterBodyChangeHandler={this.detailWaterBodyChangeHandler}/>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              {this.state.hideAlert ? null : showAlert}

              <Route exact path="/" component={Home} />
              <Route exact path="/waterbody/index" component={() => <WaterBodiesIndex isAuth={this.state.isAuth} userData={this.state.userData} />} />
              <Route exact path="/register" component={() => <Register registerHandler={this.registerHandler} />} />
              <Route exact path="/login" component={() => <Login loginHandler={this.loginHandler} />} />
            </div>
          )}
        {this.state.detailWaterBody ?
          <Route exact path="/waterbody/details" component={() => <WaterBody isAuth={this.state.isAuth} user={this.state.userData} waterBody={this.state.detailWaterBody} />} />
          : null}
      </div>
    )
  }
} export default withRouter(App);
