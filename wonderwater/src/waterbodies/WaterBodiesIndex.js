import React, { Component } from 'react'
import { Card, CardDeck, Button } from 'react-bootstrap';
import axios from 'axios';
import { BrowserRouter as Router, Link } from "react-router-dom";
import EditWaterBody from './EditWaterBody';
import WaterBody from './WaterBody';

export default class WaterBodiesIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: [],
            editWaterBody: null,
            detailWaterBody: null,
            isIndex: false,
            isDetails: false
        }
    }

    componentDidMount() {
        this.loadWaterBodies();
    }

    loadWaterBodies = () => {
        axios.get("/wonderwater/waterbody/index")
            .then(response => {
                console.log(response)
                this.setState({
                    waterBodies: response.data,
                    isIndex: true,
                    isDetails: false
                })
            })
            .catch(error => {
                console.log(error)
            })


    }

    deleteWaterBody = (id) => {
        axios.delete(`/wonderwater/waterbody/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response)
                this.loadWaterBodies();
            })
            .catch(error => {
                console.log(error)
            })
    }

    editWaterBodyHandler = (waterBody) => {
        axios.put("/wonderwater/waterbody/edit", waterBody, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response)
                this.loadWaterBodies();
            })
            .catch(error => {
                console.log(error)
            })
    }


    render() {
        let waterBodiesList = this.state.waterBodies.map(waterBody =>
            <Card key={waterBody.waterBodyId}>
                <Card.Img variant="top" src={waterBody.picture} />
                <Card.Body>
                    <Card.Title>
                        <Router>
                            <Link to="/waterbody/details">
                                <span onClick={() => this.setState({ detailWaterBody: waterBody, isIndex: false, isDetails: true })}>{waterBody.name}</span>
                            </Link>
                        </Router>
                    </Card.Title>
                </Card.Body>
                {this.props.isAuth && this.props.userData.id == waterBody.user.id ?
                    <Card.Footer>
                        <Router>
                            <Link to="/waterbody/edit">
                                <Button variant="outline-primary" onClick={() => this.setState({ editWaterBody: waterBody, isIndex: false })}>Edit</Button>
                            </Link>
                        </Router>
                        <Button variant="outline-primary" onClick={() => this.deleteWaterBody(waterBody.waterBodyId)}>Delete</Button>
                    </Card.Footer>
                    : null}

            </Card>
        )

        return (
            <div>

                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1)}
                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "index" || this.state.isIndex ?
                    (<CardDeck>
                        {waterBodiesList}
                    </CardDeck>) :
                    (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "edit" ?
                        <EditWaterBody user={this.props.userData} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />
                        : <WaterBody isAuth={this.props.isAuth} user={this.props.userData} waterBody={this.state.detailWaterBody} />)
                }

            </div>
        )
    }
}
