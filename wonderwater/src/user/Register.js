import React, { Component } from 'react'
import { Form, Button, Container } from 'react-bootstrap'

export default class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userInfo: { "userRole": "ROLE_USER" },
            image: null
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

    registerHandler = (event) => {
        event.preventDefault()
        if(this.state.userInfo.password !== this.state.userInfo.cpassword){
            console.log("password and confirm password must be equal")
        }
        else{
            const imageRegex = new RegExp('jpg|png|jpeg{1}')
            if(imageRegex.test(this.state.userInfo.picture)){
                this.props.registerHandler(this.state.userInfo); 
            }
           else{
               console.log("please enter a valid image")
           }
        }
        
    }

    render() {
        return (
                <Container>
                <p className="pageTitle">Register</p>
                    <Form onSubmit={this.registerHandler}>
                        <img className="registerImage" width="300" height="300" src={this.state.image ? this.state.image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7HrjlxizejA_sfkfPhIaAdv5Cxy6A-HGFzA&usqp=CAU"} />
                        <Form.Group>
                            <Form.Label>Picture</Form.Label>
                            <Form.Control type="url" name="picture" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="firstName" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="lastName" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" name="emailAddress" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" name="cpassword" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Register</button>
                    </Form>
                </Container>
        )
    }
}
