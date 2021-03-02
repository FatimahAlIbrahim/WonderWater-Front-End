import axios from 'axios';
import React, { Component } from 'react'
import { Tabs, Tab, Form, Container } from 'react-bootstrap'
import BookmarkCard from '../bookmark/BookmarkCard';
import EditWaterBody from '../waterbodies/EditWaterBody';
import WaterBody from '../waterbodies/WaterBody';
import WaterBodyCard from '../waterbodies/WaterBodyCard';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import UserEdit from './UserEdit';

export default class UserProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: this.props.waterBodies,
            bookmarks: this.props.bookmarks,
            user: this.props.user,
            isProfile: true,
            editWaterBody: null,
            detailWaterBody: null,
            password: null,
            allowEditUser: false
        }
    }

    componentDidMount() {
        this.loadUserData();
        this.loadWaterBodies();
        this.loadBookmarks();
    }

    loadWaterBodies = () => {
        axios.get(`/wonderwater/waterbody/find?id=${this.state.user.id}`).then(response => {
            this.setState({
                waterBodies: response.data,
                isProfile: true
            })
        }).catch(error => {
            this.props.handleAlert("An error occurred while loading your water bodies. Please try again later", "danger");
        })
    }

    loadBookmarks = () => {
        axios.get(`/wonderwater/bookmark/find?id=${this.state.user.id}`).then(response => {
            this.setState({
                bookmarks: response.data
            })
        }).catch(error => {
            this.props.handleAlert("An error occurred while loading your bookmarks. Please try again later", "danger");
        })
    }

    loadUserData = () => {
        axios.get(`/wonderwater/user/userInfo?email=${this.state.user.emailAddress}`).then(response => {
            this.setState({
                user: { ...response.data },
                allowEditUser: false,
                password: null,
            })
        }).catch(error => {
            this.props.handleAlert("An error occurred while loading your information. Please try again later", "danger");
        })
    }

    deleteWaterBody = (id) => {
        axios.delete(`/wonderwater/waterbody/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
                this.props.handleAlert("Successfully deleted a water body!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while deleting the water body. Please try again later", "danger");
            })
    }

    editWaterBodyHandler = (waterBody) => {
        axios.put("/wonderwater/waterbody/edit", waterBody, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
                this.props.handleAlert("Successfully edited a water body!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while editing the water body. Please try again later", "danger");
            })
    }

    showEdit = (waterBody) => {
        this.setState({
            editWaterBody: waterBody,
            isProfile: false
        })
    }

    showDetails = (waterBody) => {
        this.setState({
            detailWaterBody: waterBody,
            isProfile: false
        })
    }

    deleteBookmarkHandler = (id) => {
        axios.delete(`/wonderwater/bookmark/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while deleting the bookmark. Please try again later", "danger");
            })
    }

    onChange = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    checkPassword = (event) => {
        event.preventDefault();
        axios.post("/wonderwater/user/checkPassword", { "id": this.state.user.id, "password": this.state.password }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                if (response.data == true) {
                    this.setState({
                        password: null,
                        allowEditUser: true,
                        isProfile: false
                    })
                }
                else {
                    this.setState({
                        password: null,
                        allowEditUser: false
                    })
                    this.props.handleAlert("Please enter the correct password", "danger");
                }
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while checking your password. Please try again later", "danger");
            })
        event.target.reset();
    }

    editUserHandler = (user) => {
        axios.put("/wonderwater/user/edit", user, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
                this.props.handleAlert("Successfully updated your information!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while updating your information. Please try again later", "danger");
            })
    }

    render() {

        let waterBodiesList = this.state.waterBodies.map(waterBody =>
            <WaterBodyCard key={waterBody.waterBodyId} waterBody={waterBody} isAuth={this.props.isAuth} userData={this.state.user} deleteWaterBody={this.deleteWaterBody} showEdit={this.showEdit} showDetails={this.showDetails} />
        )

        let bookmarkList = this.state.bookmarks.map(bookmark =>
            <BookmarkCard key={bookmark[1]} bookmark={bookmark} deleteBookmarkHandler={this.deleteBookmarkHandler} showDetails={this.showDetails} />
        )

        return (
            <Container className="page">
                <Router>
                    {this.state.allowEditUser ?
                        <>
                            <Redirect to="/user/userEdit" />
                            <Route exact path="/user/userEdit" component={() => <UserEdit user={this.state.user} editUserHandler={this.editUserHandler} />} />
                        </>
                        : <Redirect to="/user/profile" />}
                </Router>

                {(window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "profile" || this.state.isProfile) && !this.state.allowEditUser ?
                    (<>
                        <p className="pageTitle">User Profile</p>
                        <div className="userInfoContainer">
                            <img src={this.state.user.picture} />
                            <div className="userDetails">
                                <p>First Name: {this.state.user.firstName}</p>
                                <p>Last Name: {this.state.user.lastName}</p>
                                <p>Email Address: {this.state.user.emailAddress}</p>

                            </div>
                        </div>
                        <div className="checkPasswordContainer">
                            <p>Enter your current password and submit to be able to update your information</p>
                            <Form inline onSubmit={this.checkPassword}>
                                <span>Current Password</span>
                                <Form.Control placeholder="Enter password here..." onChange={this.onChange} />
                                <button type="submit" className="btn-style">Submit</button>
                            </Form>
                        </div>
                        <hr />

                        <Tabs transition={false} defaultActiveKey="myPosts">
                            <Tab eventKey="myPosts" title="My Posts" >
                                {this.state.waterBodies.length ?
                                    (<div className="cardFlex">
                                        {waterBodiesList}
                                    </div>) : <p className="empty">There are no posts to show yet</p>}
                            </Tab>
                            <Tab eventKey="myBookmardks" title="My Bookmarks">
                                {this.state.bookmarks.length ?
                                    (<div className="cardFlex">
                                        {bookmarkList}
                                    </div>) : <p className="empty">There are no bookmarks to show yet</p>}
                            </Tab>
                        </Tabs>
                    </>
                    ) :
                    (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "edit" ?
                        <EditWaterBody user={this.state.user} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />
                        : (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "details" ?
                            <WaterBody handleAlert={(message, messageType) => { this.props.handleAlert(message, messageType) }} isAuth={this.props.isAuth} user={this.state.user} waterBody={this.state.detailWaterBody} /> : null)
                    )
                }
            </Container>
        )
    }
}
