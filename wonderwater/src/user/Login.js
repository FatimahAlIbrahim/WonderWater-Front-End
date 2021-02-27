import React, { Component } from 'react'
import { Form, Button, Container } from 'react-bootstrap'

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userInfo: {}
        }
    }

    changeHandler = (event) => {
        let userInfoTemp = { ...this.state.userInfo };
        userInfoTemp[event.target.name] = event.target.value;
        this.setState({
            userInfo: userInfoTemp
        });
    }

    loginHandler = (event) => {
        event.preventDefault();
        this.props.loginHandler(this.state.userInfo);
        event.target.reset();
    }

    render() {
        return (
            <div className="page">
                <Container>
                    <p className="pageTitle">Login</p>
                    <Form onSubmit={this.loginHandler}>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" name="emailAddress" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Login</button>
                    </Form>
                </Container>
            </div>
        )
    }
}
