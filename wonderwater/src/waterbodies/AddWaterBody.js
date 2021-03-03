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
            video: null,
            errors: {"description": "please enter a description"}
        }
    }

    changeHandler = (event) => {
        let waterBodyTemp = { ...this.state.waterBody };
        waterBodyTemp[event.target.name] = event.target.value;
        if (event.target.name == "picture") {
            const imageRegex = new RegExp('jpg|png|jpeg{1}')
            if (!imageRegex.test(event.target.value)) {
                this.setState({
                    waterBody: waterBodyTemp,
                    image: event.target.value,
                    errors: { ...this.state.errors, "picture": "please enter a valid image" }
                });
            }
            else {
                this.setState({
                    waterBody: waterBodyTemp,
                    image: event.target.value,
                    errors: { ...this.state.errors, "picture": null }
                });
            }
        }
        else if (event.target.name == "video") {
            if (event.target.value.includes("youtube")) {
                const regex = new RegExp('https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9\_-]){11}');
                if (!regex.test(event.target.value)) {
                    this.setState({
                        waterBody: waterBodyTemp,
                        video: event.target.value,
                        errors: { ...this.state.errors, "video": "please make sure to get the embed code of the youtube video" }
                    });
                }
                else {
                    this.setState({
                        waterBody: waterBodyTemp,
                        video: event.target.value,
                        errors: { ...this.state.errors, "video": null }
                    });
                }
            }
            else {
                this.setState({
                    waterBody: waterBodyTemp,
                    video: event.target.value,
                    errors: { ...this.state.errors, "video": "please make sure to get the embed code of youtube videos only" }
                });
            }
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
        if (html == "<p><br></p>" || html == null) {
            this.setState({
                waterBody: waterBodyTemp,
                errors: { ...this.state.errors, "description": "please enter a description" }
            })
        }
        else {
            this.setState({
                waterBody: waterBodyTemp,
                errors: { ...this.state.errors, "description": null }
            })
        }
    }

    addWaterBodyHandler = (event) => {
        event.preventDefault();

        if(this.state.errors["picture"] == null && this.state.errors["video"] == null && this.state.errors["description"] == null){
            this.props.addWaterBodyHandler(this.state.waterBody);
        }
    }

    render() {
        return (
            <Container className="page">
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
                        <Form.Label>Picture</Form.Label> <span className="error">{this.state.errors["picture"] ? ` ${this.state.errors["picture"]}` : null}</span>
                        <Form.Control type="url" name="picture" onChange={this.changeHandler} required></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Video</Form.Label> <span className="error">{this.state.errors["video"] ? ` ${this.state.errors["video"]}` : null}</span>
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
                            <option value="waterfall">Waterfall</option>
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
                        <Form.Label>Description</Form.Label> <span className="error">{this.state.errors["description"] ? ` ${this.state.errors["description"]}` : null}</span>
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
        )
    }
}
