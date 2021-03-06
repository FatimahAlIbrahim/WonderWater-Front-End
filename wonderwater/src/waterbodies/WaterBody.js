import React, { Component } from 'react'
import { Tabs, Tab, Container } from 'react-bootstrap'
import AddComment from '../comment/AddComment'
import CommentIndex from '../comment/CommentIndex'
import axios from 'axios'
import EditComment from '../comment/EditComment'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import safe from './../images/safe.png'
import dangerous from './../images/dangerous.png'
import swimming from './../images/swimming.png'
import noSwimming from './../images/noSwimming.png'
import by from './../images/by.png'
import location from './../images/location.png'

export default class WaterBody extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBody: { ...props.waterBody },
            editComment: null
        }
    }

    componentDidMount() {
        this.loadWaterBodyDetails();
    }

    loadWaterBodyDetails = () => {
        axios.get(`${process.env.REACT_APP_BACK_END_URL}waterbody/details?id=${this.props.waterBody.waterBodyId}`)
            .then(response => {
                this.setState({
                    waterBody: response.data,
                    editComment: null
                })
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while loading the water body details. Please try again later", "danger");
            })
    }

    addCommentHandler = (comment) => {
        axios.post(`${process.env.REACT_APP_BACK_END_URL}comment/add`, comment, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodyDetails();
                this.props.handleAlert("Successfully added a comment!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while adding the comment. Please try again later", "danger");
            })
    }

    deleteCommentHandler = (id) => {
        axios.delete(`${process.env.REACT_APP_BACK_END_URL}comment/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodyDetails();
                this.props.handleAlert("Successfully deleted the comment!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while deleting the comment. Please try again later", "danger");
            })
    }

    editCommentHandler = (comment) => {
        axios.put(`${process.env.REACT_APP_BACK_END_URL}comment/edit`, comment, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodyDetails();
                this.props.handleAlert("Successfully edited the comment!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while editing the comment. Please try again later", "danger");
            })
    }

    getEditComment = (comment) => {
        this.setState({
            editComment: comment
        })
    }

    addBookmarkHandler = () => {
        axios.post(`${process.env.REACT_APP_BACK_END_URL}bookmark/add`, { "user": { ...this.props.user }, "waterBody": { ...this.state.waterBody } }, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodyDetails();
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while bookmarking this water body. Please try again later", "danger");
            })
    }

    deleteBookmarkHandler = () => {
        axios.delete(`${process.env.REACT_APP_BACK_END_URL}bookmark/delete?id=${this.state.waterBody.bookmarks[this.state.waterBody.bookmarks.findIndex(bookmark => bookmark.user.id === this.props.user.id)].bookmarkId}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodyDetails();
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while removing the bookmark from this water body. Please try again later", "danger");
            })
    }

    render() {
        return (
            <Container className="page">
                <p className="pageTitle">Waterbody Details</p>
                <Tabs transition={false} defaultActiveKey="picture">
                    <Tab eventKey="picture" title="Picture">
                        <img width="100%" height="500" src={this.state.waterBody.picture} />
                    </Tab>
                    <Tab eventKey="video" title="Video">
                        <iframe width="100%" height="500" src={this.state.waterBody.video} allowFullScreen /> :
                    </Tab>
                </Tabs>

                <div className="detailsNameDiv">
                    <p>{this.state.waterBody.name} {this.state.waterBody.type}</p>
                    <div>
                        {this.props.isAuth && this.state.waterBody.user.id !== this.props.user.id ?
                            (this.state.waterBody.bookmarks.findIndex(bookmark => bookmark.user.id === this.props.user.id) !== -1 ?
                                <button className="btn-style" onClick={this.deleteBookmarkHandler}>Remove Bookmark</button> :
                                <button className="btn-style" onClick={this.addBookmarkHandler}>Bookmark</button>)
                            : null}
                    </div>
                </div>

                <div className="detailsOthersDiv">
                    <p><img width="25px" src={by} /> {this.state.waterBody.user.firstName} {this.state.waterBody.user.lastName}</p>
                    {this.state.waterBody.dangerous ? <p><img width="25px" src={dangerous} /> Dangerous</p> : <p><img width="25px" src={safe} /> Safe</p>}
                    {this.state.waterBody.allowSwimming ? <p><img width="25px" src={swimming} /> Allow Swimming</p> : <p><img width="25px" src={noSwimming} /> Doesn't Allow Swimming</p>}
                    <p><img width="25px" src={location} /> {this.state.waterBody.country}</p>
                </div>

                <p className="description">
                    <ReactQuill value={this.state.waterBody.description} readOnly={true} theme={"bubble"} />
                </p>

                {this.props.isAuth && this.state.waterBody.comments.findIndex(comment => comment.user.id === this.props.user.id) === -1 && this.state.waterBody.user.id !== this.props.user.id ? <AddComment addCommentHandler={this.addCommentHandler} user={this.props.user} waterBody={this.state.waterBody} /> : null}
                {this.props.isAuth && this.state.waterBody.comments.findIndex(comment => comment.user.id === this.props.user.id) !== -1 && this.state.editComment != null ? <EditComment waterBody={this.state.waterBody} editCommentHandler={this.editCommentHandler} comment={this.state.editComment} /> : null}
                {this.state.waterBody.comments.length ? <CommentIndex isAuth={this.props.isAuth} user={this.props.user} comments={this.state.waterBody.comments} deleteCommentHandler={this.deleteCommentHandler} getEditComment={this.getEditComment} /> : null}
            </Container>
        )
    }
}
