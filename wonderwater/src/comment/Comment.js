import React, { Component } from 'react'

export default class Comment extends Component {
    render() {
        return (
            <div>
                <p>By {this.props.comment.user.firstName} {this.props.comment.user.lastName}</p>
                <p>{this.props.comment.commentBody}</p>
                <button onClick={() => {this.props.getEditComment(this.props.comment)}}>Edit</button>
                <button onClick={() => {this.props.deleteCommentHandler(this.props.comment.commentId)}}>Delete</button>
            </div>
        )
    }
}
