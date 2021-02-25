import React, { Component } from 'react'
import { Button, Container, Form } from 'react-bootstrap';

export default class UserEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userInfo: { ...this.props.user },
            image: this.props.user.picture
        }
    }

    changeHandler = (event) => {
        let userInfoTemp = { ...this.state.userInfo };
        userInfoTemp[event.target.name] = event.target.value;
        if (event.target.name == "picture") {
            this.setState({
                userInfo: userInfoTemp,
                image: event.target.value
            });
        }
        else {
            this.setState({
                userInfo: userInfoTemp
            });
        }
        console.log(userInfoTemp)
    }

    editUserHandler = (event) => {
        event.preventDefault()
        if (this.state.userInfo.password !== this.state.userInfo.cpassword) {
            console.log("password and confirm password must be equal")
        }
        else {
            this.props.editUserHandler(this.state.userInfo);
        }

    }

    render() {
        return (
            <div>
                <Container>
                    <Form onSubmit={this.editUserHandler}>
                        <img width="300" height="300" src={this.state.image ? this.state.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7HrjlxizejA_sfkfPhIaAdv5Cxy6A-HGFzA&usqp=CAU"} />
                        <Form.Group>
                            <Form.Label>Picture</Form.Label>
                            <Form.Control type="url" name="picture" onChange={this.changeHandler} value={this.state.userInfo.picture} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" onChange={this.changeHandler} value={this.state.userInfo.firstName} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" onChange={this.changeHandler} value={this.state.userInfo.lastName} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control type="password" name="cpassword" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Button variant="outline-primary" block type="submit">Edit Information</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}
