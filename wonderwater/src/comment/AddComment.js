import React, { Component } from 'react'
import {Form, Button, Container} from 'react-bootstrap'

export default class AddComment extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            comment: {
                "user": { ...props.user },
                "waterBody": {...props.waterBody}
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

    addCommentHandler = (event) => {
        event.preventDefault();
        this.props.addCommentHandler(this.state.comment)
    }

    render() {
        return (
            <div>
                <Container>
                    <Form onSubmit={this.addCommentHandler}>
                        <Form.Group>
                            <Form.Label>Comment Body</Form.Label>
                            <Form.Control as="textarea" name="commentBody" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Add Comment</button>
                    </Form>
                </Container>
            </div>
        )
    }
}
