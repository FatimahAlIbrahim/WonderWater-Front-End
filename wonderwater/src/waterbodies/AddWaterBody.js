import React, { Component } from 'react'
import { Form, Button, Container, Tabs, Tab } from 'react-bootstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default class AddWaterBody extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBody: {
                "user": { ...props.user },
                "type": "lake",
                "dangerous": true,
                "allowSwimming": true
            },
            image: null,
            video: null
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

    editorChangeHandler = (html) => {
        let waterBodyTemp = { ...this.state.waterBody };
        waterBodyTemp["description"] = html;
        console.log(waterBodyTemp);
        this.setState({
            waterBody: waterBodyTemp
        })
    }

    addWaterBodyHandler = (event) => {
        event.preventDefault();
        const imageRegex = new RegExp('jpg|png|jpeg{1}')
        if (imageRegex.test(this.state.waterBody.picture)) {
            let video = this.state.waterBody.video;
            if (video.includes("youtube")) {
                const regex = new RegExp('https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\_-]){11}');
                if (regex.test(video)) {
                    if (this.state.waterBody.description == "<p><br></p>" || this.state.waterBody.description == null) {
                        window.scrollTo(0, 0);
                        this.props.handleAlert("Please enter a description", "danger")
                    }
                    else {
                        this.props.addWaterBodyHandler(this.state.waterBody);
                    }
                }
                else {
                    window.scrollTo(0, 0);
                    this.props.handleAlert("Please make sure to get the embed code of the youtube video", "danger");
                }
            }
            else {
                window.scrollTo(0, 0);
                this.props.handleAlert("Please make sure to get the embed code of youtube videos only", "danger");
            }
        }
        else {
            window.scrollTo(0, 0);
            this.props.handleAlert("Please provide a valid image url", "danger");
        }
    }

    render() {
        return (
            <div className="page">
                <Container>
                    <p className="pageTitle">Add Water Body</p>
                    <Form onSubmit={this.addWaterBodyHandler}>
                        <Tabs transition={false} defaultActiveKey="picture">
                            <Tab eventKey="picture" title="Picture">
                                <img width="100%" height="400" src={this.state.image ? this.state.image : "https://i.stack.imgur.com/y9DpT.jpg"} />
                            </Tab>
                            <Tab eventKey="video" title="Video">
                                <iframe width="100%" height="400" src={this.state.video} allowFullScreen />
                            </Tab>
                        </Tabs>
                        <Form.Group>
                            <Form.Label>Picture</Form.Label>
                            <Form.Control type="url" name="picture" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Video</Form.Label>
                            <Form.Control type="url" name="video" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Control type="text" name="country" onChange={this.changeHandler} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" name="type" onChange={this.changeHandler}>
                                <option value="lake">Lake</option>
                                <option value="river">River</option>
                                <option value="spring">Spring</option>
                                <option value="sea">Sea</option>
                                <option value="pool">Pool</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Dangerous</Form.Label>
                            <Form.Control as="select" name="dangerous" onChange={this.changeHandler}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Allow Swimming</Form.Label>
                            <Form.Control as="select" name="allowSwimming" onChange={this.changeHandler}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <ReactQuill name="description" theme="snow" onChange={this.editorChangeHandler}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

                                        ['clean']
                                    ],
                                    clipboard: {
                                        matchVisual: false,
                                    }
                                }}
                                formats={[
                                    'bold', 'italic', 'underline', 'strike',
                                    'list', 'bullet'
                                ]}
                            />
                        </Form.Group>
                        <button className="btn-style btn-block" type="submit">Add Water Body</button>
                    </Form>
                </Container>
            </div>
        )
    }
}
