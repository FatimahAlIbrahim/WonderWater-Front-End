import React, { Component } from 'react'
import Comment from './Comment'

export default class CommentIndex extends Component {
    render() {
        return (
            <div>
                <h3>Comments</h3>
                {this.props.comments.map((comment) => 
                    <Comment getEditComment={(comment)=> this.props.getEditComment(comment)} deleteCommentHandler={(id)=> this.props.deleteCommentHandler(id)} isAuth={this.props.isAuth} user={this.props.user} key={comment.commentId} comment={comment}/>
                )}
            </div>
        )
    }
}
