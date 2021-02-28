import React, { Component } from 'react'
import {Form, Button, Container} from 'react-bootstrap'

export default class EditComment extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            comment: {...props.comment, "waterBody": {...props.waterBody}
            },
        }
    }

    changeHandler = (event) => {
        let commentTemp = { ...this.state.comment };
        commentTemp[event.target.name] = event.target.value;
        console.log(commentTemp)
        this.setState({
            comment: commentTemp
        });
    }

    editCommentHandler = (event) => {
        event.preventDefault();
        this.props.editCommentHandler(this.state.comment)
    }

    render() {
        return (
            <div>
                 <Container>
                    <Form onSubmit={this.editCommentHandler}>
                        <Form.Group>
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as="textarea" name="commentBody" onChange={this.changeHandler} value={this.state.comment.commentBody} required></Form.Control>
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Edit Comment</button>
                    </Form>
                </Container>
            </div>
        )
    }
}
