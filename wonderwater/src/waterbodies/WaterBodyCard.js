import React, { Component } from 'react'
import { BrowserRouter as Router, Link } from "react-router-dom"
import { Card } from 'react-bootstrap'
import safe from './../images/safe.png'
import dangerous from './../images/dangerous.png'
import swimming from './../images/swimming.png'
import noSwimming from './../images/noSwimming.png'

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
            <Card className="cards">
                <Card.Img variant="top" src={this.props.waterBody.picture} />
                <Card.Body>
                    <Card.Title>
                        <span>{this.props.waterBody.dangerous ? <img width="16px" src={dangerous} /> : <img width="25px" src={safe} />}</span> {' '}
                        <span>{this.props.waterBody.allowSwimming ? <img width="20px" src={swimming} /> : <img width="20px" src={noSwimming} />}</span> {' '}
                        <Router>
                            <Link to="/waterbody/details">
                                <span onClick={this.showDetails}>{this.props.waterBody.name} {this.props.waterBody.type}</span>
                            </Link>
                        </Router>
                    </Card.Title>
                    <Card.Text>
                        In {this.props.waterBody.country}
                        <span id="controls">
                            {this.props.isAuth && this.props.userData.id == this.props.waterBody.user.id ?
                                <><Router>
                                    <Link to="/waterbody/edit">
                                        <span onClick={this.showEdit}>Edit /</span>
                                    </Link>
                                </Router></> : null}
                            {this.props.isAuth && (this.props.userData.id == this.props.waterBody.user.id || this.props.userData.userRole === "ROLE_ADMIN") ?
                                <span onClick={this.handleDelete}> Delete</span> : null}
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}
