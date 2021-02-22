import React, { Component } from 'react'
import { Form, Button, Container, Tabs, Tab } from 'react-bootstrap'


export default class EditWaterBody extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            waterBody: {
                "user": { ...props.user },
                ...props.waterBody
            },
            image: props.waterBody.picture,
            video: props.waterBody.video,
        }
    }

    changeHandler = (event) => {
        let waterBodyTemp = { ...this.state.waterBody };
        waterBodyTemp[event.target.name] = event.target.value;
        console.log(waterBodyTemp);
        if (event.target.name == "picture") {
            this.setState({
                waterBody: waterBodyTemp,
                image: event.target.value
            });
        }
        else if (event.target.name == "video") {
            this.setState({
                waterBody: waterBodyTemp,
                video: event.target.value
            });
        }
        else {
            this.setState({
                waterBody: waterBodyTemp
            });
        }
    }

    editWaterBodyHandler = (event) => {
        event.preventDefault();
        const imageRegex = new RegExp('jpg|png|jpeg{1}')
        if (imageRegex.test(this.state.waterBody.picture)) {
            let video = this.state.waterBody.video;
            if (video.includes("youtube")) {
                const regex = new RegExp('https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\_-]){11}');
                if (regex.test(video)) {
                    this.props.editWaterBodyHandler(this.state.waterBody);
                }
                else {
                    console.log("please make sure to get the embed code of the youtube video")
                }
            }
            else {
                console.log("please make sure to get the embed code of youtube videos only")
            }
        }
        else {
            console.log("please provide a valid image url")
        }
    }

    render() {
        return (
            <div>
                <Container>
                    <Form onSubmit={this.editWaterBodyHandler}>
                        <Tabs transition={false} defaultActiveKey="picture">
                            <Tab eventKey="picture" title="Picture">
                                <img width="100%" height="400" src={this.state.image ? this.state.image : "https://i.stack.imgur.com/y9DpT.jpg"} />
                            </Tab>
                            <Tab eventKey="video" title="Video">
                                <iframe width="100%" height="400" src={this.state.video} allowFullScreen /> :
                            </Tab>
                        </Tabs>
                        <Form.Group>
                            <Form.Label>Picture</Form.Label>
                            <Form.Control type="url" name="picture" onChange={this.changeHandler} value={this.state.image} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Video</Form.Label>
                            <Form.Control type="url" name="video" onChange={this.changeHandler} value={this.state.video} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={this.changeHandler} value={this.state.waterBody.name} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" onChange={this.changeHandler} value={this.state.waterBody.country} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="type" onChange={this.changeHandler} value={this.state.waterBody.type}>
                                <option value="lake">Lake</option>
                                <option value="river">River</option>
                                <option value="spring">Spring</option>
                                <option value="sea">Sea</option>
                                <option value="pool">Pool</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dangerous</Form.Label>
                            <Form.Control as="select" name="dangerous" onChange={this.changeHandler} value={this.state.waterBody.dangerous}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Allow Swimming</Form.Label>
                            <Form.Control as="select" name="allowSwimming" onChange={this.changeHandler} value={this.state.waterBody.allowSwimming}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" onChange={this.changeHandler} required value={this.state.waterBody.description}></Form.Control>
                        </Form.Group>
                        <Button variant="outline-primary" block type="submit">Edit Water Body</Button>
                    </Form>
                </Container>
            </div>
        )
    }
}
