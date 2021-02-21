import React, { Component } from 'react'
import { Card, CardDeck, Button } from 'react-bootstrap';
import axios from 'axios';

export default class WaterBodiesIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: []
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
                    waterBodies: response.data
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

    editListener = (waterBody) => {
        this.props.editListener(waterBody);
    }


    render() {
        let waterBodiesList = this.state.waterBodies.map(waterBody =>
            <Card key={waterBody.waterBodyId}>
                <Card.Img variant="top" src={waterBody.picture} />
                <Card.Body>
                    <Card.Title>{waterBody.name}</Card.Title>
                </Card.Body>
                {this.props.isAuth && this.props.userData.id == waterBody.user.id ?
                    <Card.Footer>
                        <Button variant="outline-primary" onClick={() => this.editListener(waterBody)}>Edit</Button>
                        <Button variant="outline-primary" onClick={() => this.deleteWaterBody(waterBody.waterBodyId)}>Delete</Button>
                    </Card.Footer>
                    : null}

            </Card>
        )

        return (
            <div>
                <CardDeck>
                    {waterBodiesList}
                </CardDeck>
            </div>
        )
    }
}
