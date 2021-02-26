import React, { Component } from 'react'

export default class Comment extends Component {
    render() {
        return (
            <div>
                <p>By {this.props.comment.user.firstName} {this.props.comment.user.lastName}</p>
                <p>{this.props.comment.commentBody}</p>
                {this.props.isAuth && this.props.user.id == this.props.comment.user.id ?
                    <button onClick={() => { this.props.getEditComment(this.props.comment) }}>Edit</button> : null}
                {
                    this.props.isAuth && (this.props.user.id == this.props.comment.user.id || this.props.user.userRole === "ROLE_ADMIN") ?
                        <button onClick={() => { this.props.deleteCommentHandler(this.props.comment.commentId) }}>Delete</button> : null
                }

            </div>
        )
    }
}
