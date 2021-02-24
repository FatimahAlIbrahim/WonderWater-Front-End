import axios from 'axios';
import React, { Component } from 'react'
import { Tabs, Tab, CardDeck } from 'react-bootstrap'
import BookmarkCard from '../bookmark/BookmarkCard';
import EditWaterBody from '../waterbodies/EditWaterBody';
import WaterBody from '../waterbodies/WaterBody';
import WaterBodyCard from '../waterbodies/WaterBodyCard';

export default class UserProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: this.props.waterBodies,
            bookmarks: this.props.bookmarks,
            user: this.props.user,
            isProfile: true,
            editWaterBody: null,
            detailWaterBody: null
        }
    }

    componentDidMount() {
        this.loadUserData();
        this.loadWaterBodies();
        this.loadBookmarks();
    }

    loadWaterBodies = () => {
        axios.get(`/wonderwater/waterbody/find?id=${this.state.user.id}`).then(response => {
            console.log(response);
            this.setState({
                waterBodies: response.data,
                isProfile: true
            })
        }).catch(error => {
            console.log(error);
        })
    }

    loadBookmarks = () => {
        axios.get(`/wonderwater/bookmark/find?id=${this.state.user.id}`).then(response => {
            console.log(response)
            this.setState({
                bookmarks: response.data
            })
        }).catch(error => {
            console.log(error);
        })
    }

    loadUserData = () => {
        axios.get(`/wonderwater/user/userInfo?email=${this.state.user.emailAddress}`).then(response => {
            console.log(response);
            this.setState({
                user: { ...response.data }
            })
        }).catch(error => {
            console.log(error)
        })
    }

    deleteWaterBody = (id) => {
        axios.delete(`/wonderwater/waterbody/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response)
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
            })
            .catch(error => {
                console.log(error)
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
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
            })
            .catch(error => {
                console.log(error)
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
                console.log(response)
                this.loadUserData();
                this.loadWaterBodies();
                this.loadBookmarks();
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {

        let waterBodiesList = this.state.waterBodies.map(waterBody =>
            <WaterBodyCard key={waterBody.waterBodyId} waterBody={waterBody} isAuth={this.props.isAuth} userData={this.state.user} deleteWaterBody={this.deleteWaterBody} showEdit={this.showEdit} showDetails={this.showDetails} />
        )

        let bookmarkList = this.state.bookmarks.map(bookmark =>
            <BookmarkCard key={bookmark[1]} bookmark={bookmark} deleteBookmarkHandler={this.deleteBookmarkHandler}/>
        )

        return (
            <div>
                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1)}
                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "profile" || this.state.isProfile ?
                    (<>
                        <img src={this.props.user.picture} />
                        <p>First Name: {this.props.user.firstName}</p>
                        <p>Last Name: {this.props.user.lastName}</p>
                        <p>Email Address: {this.props.user.emailAddress}</p>
                        <hr />

                        <Tabs transition={false} defaultActiveKey="myPosts">
                            <Tab eventKey="myPosts" title="My Posts">
                                {this.state.waterBodies.length? 
                                (<CardDeck>
                                    {waterBodiesList}
                                </CardDeck>) : <p>There are no posts to show yet</p>}
                        </Tab>
                            <Tab eventKey="myBookmardks" title="My Bookmarks">
                            {this.state.bookmarks.length? 
                                (<CardDeck>
                                    {bookmarkList}
                                </CardDeck>) : <p>There are no bookmarks to show yet</p>}
                        </Tab>
                        </Tabs>
                    </>
                    ) :
                    (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "edit" ?
                        <EditWaterBody user={this.state.user} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />
                        : <WaterBody isAuth={this.props.isAuth} user={this.state.user} waterBody={this.state.detailWaterBody} />)
                }


            </div>
        )
    }
}
