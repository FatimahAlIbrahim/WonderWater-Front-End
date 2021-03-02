import React, { Component } from 'react'
import axios from 'axios';
import EditWaterBody from './EditWaterBody';
import WaterBody from './WaterBody';
import WaterBodyCard from './WaterBodyCard';
import { Redirect, BrowserRouter as Router } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';

export default class WaterBodiesIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: [],
            filteredWaterBodies: [],
            editWaterBody: null,
            detailWaterBody: null,
            isIndex: false,
            filterValues: { "type": "all", "dangerous": "all", "allowSwimming": "all" }
        }
    }

    componentDidMount() {
        this.loadWaterBodies();
    }

    loadWaterBodies = () => {
        axios.get(`${process.env.REACT_APP_BACK_END_URL}waterbody/index`)
            .then(response => {
                this.setState({
                    waterBodies: response.data,
                    filteredWaterBodies: response.data,
                    isIndex: true
                })
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while loading your water bodies. Please try again later", "danger");
            })
    }

    deleteWaterBody = (id) => {
        axios.delete(`${process.env.REACT_APP_BACK_END_URL}waterbody/delete?id=${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodies();
                this.props.handleAlert("Successfully deleted a water body!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while deleting the water body. Please try again later", "danger");
            })
    }

    editWaterBodyHandler = (waterBody) => {
        axios.put(`${process.env.REACT_APP_BACK_END_URL}waterbody/edit`, waterBody, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                this.loadWaterBodies();
                this.props.handleAlert("Successfully edited a water body!", "success");
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while editing the water body. Please try again later", "danger");
            })
    }

    showEdit = (waterBody) => {
        this.setState({
            editWaterBody: waterBody,
            isIndex: false
        })
    }

    showDetails = (waterBody) => {
        this.setState({
            detailWaterBody: waterBody,
            isIndex: false
        })
    }

    filterChangeHandler = (event) => {
        event.preventDefault();
        let filterValuesTemp = { ...this.state.filterValues }
        filterValuesTemp[event.target.name] = event.target.value;
        let filteredWaterBodiesTemp = [...this.state.waterBodies]
        if (filterValuesTemp["type"] !== "all") {
            filteredWaterBodiesTemp = filteredWaterBodiesTemp.filter((waterBody) => {
                return waterBody.type.toLowerCase().includes(filterValuesTemp["type"].toLowerCase())
            })
        }
        if (filterValuesTemp["dangerous"] !== "all") {
            if (filterValuesTemp["dangerous"] === "true") {
                filteredWaterBodiesTemp = filteredWaterBodiesTemp.filter((waterBody) => {
                    return waterBody.dangerous
                })
            }
            else {
                filteredWaterBodiesTemp = filteredWaterBodiesTemp.filter((waterBody) => {
                    return !waterBody.dangerous
                })
            }
        }
        if (filterValuesTemp["allowSwimming"] !== "all") {
            if (filterValuesTemp["allowSwimming"] === "true") {
                filteredWaterBodiesTemp = filteredWaterBodiesTemp.filter((waterBody) => {
                    return waterBody.allowSwimming
                })
            }
            else {
                filteredWaterBodiesTemp = filteredWaterBodiesTemp.filter((waterBody) => {
                    return !waterBody.allowSwimming
                })
            }
        }

        this.setState({
            filteredWaterBodies: filteredWaterBodiesTemp,
            filterValues: filterValuesTemp
        })
    }

    render() {
        let waterBodiesList = this.state.filteredWaterBodies.map(waterBody =>
            <WaterBodyCard key={waterBody.waterBodyId} waterBody={waterBody} isAuth={this.props.isAuth} userData={this.props.userData} deleteWaterBody={this.deleteWaterBody} showEdit={this.showEdit} showDetails={this.showDetails} />
        )

        return (
            <Container className="page">
                <Router>
                    {this.state.isIndex ? <Redirect to="/waterbody/index" /> : null}
                </Router>
                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "index" || this.state.isIndex ?
                    <><p className="pageTitle">Water Bodies</p>
                        <div className="filter">
                            <p>Filter</p>
                            <div className="filterContainer">
                                <Form.Group>
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as="select" name="type" onChange={this.filterChangeHandler}>
                                        <option value="all">All</option>
                                        <option value="lake">Lake</option>
                                        <option value="river">River</option>
                                        <option value="spring">Spring</option>
                                        <option value="sea">Sea</option>
                                        <option value="pool">Pool</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Dangerous</Form.Label>
                                    <Form.Control as="select" name="dangerous" onChange={this.filterChangeHandler}>
                                        <option value="all">All</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Allow Swimming</Form.Label>
                                    <Form.Control as="select" name="allowSwimming" onChange={this.filterChangeHandler}>
                                        <option value="all">All</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </div>
                        <div className="cardFlex">
                            {waterBodiesList.length ? waterBodiesList : <p className="empty">There are no water bodies for this filter criteria yet</p>}
                        </div></> :
                    (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "edit" ?
                        <EditWaterBody user={this.props.userData} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />
                        : <WaterBody handleAlert={(message, messageType) => { this.props.handleAlert(message, messageType) }} isAuth={this.props.isAuth} user={this.props.userData} waterBody={this.state.detailWaterBody} />)
                }
            </Container>
        )
    }
}
