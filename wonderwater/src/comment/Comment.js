import React, { Component } from 'react'
import edit from './../images/edit.png'
import remove from './../images/delete.png'

export default class Comment extends Component {
    render() {
        return (
            <div className="commentContainer">
                <p className="commentUserImage">
                    <img src={this.props.comment.user.picture} />
                </p>
                <p className="commentBody">
                    <p id="writer">By {this.props.comment.user.firstName} {this.props.comment.user.lastName}</p>
                    <p>{this.props.comment.commentBody}</p>
                    <div>
                        {this.props.isAuth && this.props.user.id == this.props.comment.user.id ?
                            <span onClick={() => { this.props.getEditComment(this.props.comment) }}><img width="25px" src={edit} /></span> : null}
                        {
                            this.props.isAuth && (this.props.user.id == this.props.comment.user.id || this.props.user.userRole === "ROLE_ADMIN") ?
                                <span onClick={() => { this.props.deleteCommentHandler(this.props.comment.commentId) }}><img width="25px" src={remove} /></span> : null
                        }
                    </div>
                </p>
            </div>
        )
    }
}
