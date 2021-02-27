import React, { Component } from 'react'
import axios from 'axios';
import EditWaterBody from './EditWaterBody';
import WaterBody from './WaterBody';
import WaterBodyCard from './WaterBodyCard';
import { Redirect,  BrowserRouter as Router } from 'react-router-dom';

export default class WaterBodiesIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: [],
            editWaterBody: null,
            detailWaterBody: null,
            isIndex: false,
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
                    isIndex: true
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

    render() {
        let waterBodiesList = this.state.waterBodies.map(waterBody =>
            <WaterBodyCard key={waterBody.waterBodyId} waterBody={waterBody} isAuth={this.props.isAuth} userData={this.props.userData} deleteWaterBody={this.deleteWaterBody} showEdit={this.showEdit} showDetails={this.showDetails}/>
        )

        return (
            <div className="page">
                <Router>
                    {this.state.isIndex ? <Redirect to="/waterbody/index"/> : null}
                </Router>
                {window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "index" || this.state.isIndex ?
                    <><p className="pageTitle">Water Bodies</p>
                    <div className="cardFlex">
                        {waterBodiesList}
                    </div></> :
                    (window.location.href.substr(window.location.href.lastIndexOf("/") + 1) == "edit" ?
                        <EditWaterBody user={this.props.userData} waterBody={this.state.editWaterBody} editWaterBodyHandler={this.editWaterBodyHandler} />
                        : <WaterBody isAuth={this.props.isAuth} user={this.props.userData} waterBody={this.state.detailWaterBody} />)
                }

            </div>
        )
    }
}
