import React, { Component } from 'react'
import { Container, Form } from 'react-bootstrap';

export default class UserEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userInfo: { ...this.props.user },
            image: this.props.user.picture,
            errors: {}
        }
    }

    changeHandler = (event) => {
        let userInfoTemp = { ...this.state.userInfo };
        userInfoTemp[event.target.name] = event.target.value;
        if (event.target.name == "picture") {
            const imageRegex = new RegExp('jpg|png|jpeg{1}')
            if (!imageRegex.test(event.target.value)) {
                this.setState({
                    userInfo: userInfoTemp,
                    image: event.target.value,
                    errors: {...this.state.errors, "picture": "please enter a valid image"}
                });
            }
            else{
                this.setState({
                    userInfo: userInfoTemp,
                    image: event.target.value,
                    errors: {...this.state.errors, "picture": null}
                });
            }
        }
        else if(event.target.name == "cpassword") {
            if(this.state.userInfo.password !== event.target.value){
                this.setState({
                    userInfo: userInfoTemp,
                    errors: {...this.state.errors, "password": "password and confirm password must be the same"}
                });
            }
            else{
                this.setState({
                    userInfo: userInfoTemp,
                    errors: {...this.state.errors, "password": null}
                });
            }
        }
        else {
            this.setState({
                userInfo: userInfoTemp
            });
        }
    }

    editUserHandler = (event) => {
        event.preventDefault()
        if(this.state.errors["picture"] == null && this.state.errors["password"] == null){
            this.props.editUserHandler(this.state.userInfo);
        }
    }

    render() {
        return (
            <div>
                <Container className="page">
                <p className="pageTitle">Edit Personal Information</p>
                    <Form onSubmit={this.editUserHandler}>
                        <img className="registerImage" width="300" height="300" src={this.state.image ? this.state.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7HrjlxizejA_sfkfPhIaAdv5Cxy6A-HGFzA&usqp=CAU"} />
                        <Form.Group>
                            <Form.Label>Picture</Form.Label> <span className="error">{this.state.errors["picture"] ? ` ${this.state.errors["picture"]}` : null}</span>
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
                            <Form.Label>Password</Form.Label> <span className="error">{this.state.errors["password"] ? ` ${this.state.errors["password"]}` : null}</span>
                            <Form.Control type="password" name="password" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label> <span className="error">{this.state.errors["password"] ? ` ${this.state.errors["password"]}` : null}</span>
                            <Form.Control type="password" name="cpassword" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Edit Information</button>
                    </Form>
                </Container>
            </div>
        )
    }
}
