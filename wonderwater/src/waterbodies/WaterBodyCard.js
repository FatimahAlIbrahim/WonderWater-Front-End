import React, { Component } from 'react'
import { BrowserRouter as Router, Link } from "react-router-dom"
import { Card, Button } from 'react-bootstrap'

export default class WaterBodyCard extends Component {

    showDetails = () => {
        this.props.showDetails(this.props.waterBody)
    }

    showEdit = () => {
        this.props.showEdit(this.props.waterBody)
    }

    handleDelete = () => {
        this.props.deleteWaterBody(this.props.waterBody.waterBodyId)
    }

    render() {
        return (
                <Card>
                    <Card.Img variant="top" src={this.props.waterBody.picture} />
                    <Card.Body>
                        <Card.Title>
                            <Router>
                                <Link to="/waterbody/details">
                                    <span onClick={this.showDetails}>{this.props.waterBody.name}</span>
                                </Link>
                            </Router>
                        </Card.Title>
                    </Card.Body>
                    {this.props.isAuth && this.props.userData.id == this.props.waterBody.user.id ?
                        <Card.Footer>
                            <Router>
                                <Link to="/waterbody/edit">
                                    <Button variant="outline-primary" onClick={this.showEdit}>Edit</Button>
                                </Link>
                            </Router>
                            <Button variant="outline-primary" onClick={this.handleDelete}>Delete</Button>
                        </Card.Footer>
                        : null}
                </Card>
        )
    }
}
