import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import AddComment from '../comment/AddComment'
import CommentIndex from '../comment/CommentIndex'
import axios from 'axios'
import EditComment from '../comment/EditComment'

export default class WaterBody extends Component {

    constructor(props) {
        super(props)

        this.state = {
            comments: [...this.props.waterBody.comments],
            editComment: null,
        }
    }

    componentDidMount() {
        this.loadCommentList();
    }

    loadCommentList = () => {
        this.setState({
            comments: [...this.props.waterBody.comments],
            editComment: null,
        })
    }

    addCommentHandler = (comment) => {
        axios.post("/wonderwater/comment/add", comment, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response);
                this.loadCommentList();
                // const updatedCommentList = [...this.state.comments]
                // updatedCommentList.push(response.data)
                // this.setState({
                //     comments: updatedCommentList
                // })
            })
            .catch(error => {
                console.log(error);
            })
    }

    deleteCommentHandler = (id) => {
        axios.delete(`/wonderwater/comment/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response)
                this.loadCommentList();
                // const updatedCommentList = [...this.state.comments]
                // const index = updatedCommentList.findIndex(comment => comment.commentId === id)
                // if (index !== -1) {
                //     updatedCommentList.splice(index, 1)
                //     this.setState({
                //         comments: updatedCommentList
                //     })
                // }
            })
            .catch(error => {
                console.log(error)
            })
    }

    editCommentHandler = (comment) => {
        axios.put("/wonderwater/comment/edit", comment, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response)
                this.loadCommentList();
                // const updatedCommentList = [...this.state.comments]
                // const index = updatedCommentList.findIndex(commentElement => commentElement.commentId === comment.commentId)
                // if (index !== -1) {
                //     updatedCommentList.splice(index, 1, response.data)
                //     this.setState({
                //         comments: updatedCommentList,
                //         editComment: null
                //     })
                // }
            })
            .catch(error => {
                console.log(error)
            })
    }

    getEditComment = (comment) => {
        this.setState({
            editComment: comment
        })
    }

    render() {
        return (
            <div>
                waterbody details
                <Tabs transition={false} defaultActiveKey="picture">
                    <Tab eventKey="picture" title="Picture">
                        <img width="100%" height="400" src={this.props.waterBody.picture} />
                    </Tab>
                    <Tab eventKey="video" title="Video">
                        <iframe width="100%" height="400" src={this.props.waterBody.video} allowFullScreen /> :
                    </Tab>
                </Tabs>
                <h2>{this.props.waterBody.name}</h2>
                <p>Added By: {this.props.waterBody.user.firstName} {this.props.waterBody.user.lastName}</p>
                {this.props.waterBody.dangerous ? <p>Dangerous</p> : <p>Safe</p>}
                {this.props.waterBody.allowSwimming ? <p>Allow Swimming</p> : <p>Doesn't Allow Swimming</p>}
                <p>Country: {this.props.waterBody.country}</p>
                <p>Type: {this.props.waterBody.type}</p>
                <p>Description: {this.props.waterBody.description}</p>
                {this.props.isAuth && this.props.waterBody.comments.findIndex(comment => comment.user.id === this.props.user.id) === -1 ? <AddComment addCommentHandler={this.addCommentHandler} user={this.props.user} waterBody={this.props.waterBody} /> : null}
                {this.props.isAuth && this.props.waterBody.comments.findIndex(comment => comment.user.id === this.props.user.id) !== -1 && this.state.editComment != null ? <EditComment editCommentHandler={this.editCommentHandler} comment={this.state.editComment} /> : null}
                <CommentIndex isAuth={this.props.isAuth} user={this.props.user} comments={this.state.comments} deleteCommentHandler={this.deleteCommentHandler} getEditComment={this.getEditComment} />
            </div>
        )
    }
}
