import React, { Component } from 'react'
import axios from 'axios';
import WaterBody from './WaterBody';
import { FormControl } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class SearchWaterBodies extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: null,
            filterResult: null,
            filterValue: null
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

    changeHandler = (event) => {
        event.preventDefault();
        const filterValue = event.target.value;
        if (!filterValue) {
            this.setState({
                filterResult: null,
                filterValue: null
            })
        } else {
            const filterResult = this.state.waterBodies.filter((waterBody) => {
                return waterBody.name.toLowerCase().includes(filterValue.toLowerCase())
            })
            console.log(filterResult)
            this.setState({
                filterResult: filterResult,
                filterValue: filterValue
            })
        }
    }

    handleClick = (waterBody) =>{
        this.setState({
            filterResult: null,
            filterValue: ""
        })
        this.props.detailWaterBodyChangeHandler(waterBody)
    }

    render() {
        return (
            <div>
                <FormControl type="text" value={this.state.filterValue} placeholder="Search" onChange={this.changeHandler} />
                {this.state.filterResult ?
                <div className="searchResult">
                    <Router>
                        {this.state.filterResult.map((waterBody, index) =>
                            <p  key={index}>
                                <Link to="/waterbody/details" onClick={() => this.handleClick(waterBody)}>{waterBody.name} {waterBody.type}</Link>
                            </p>
                        )}
                    </Router></div> : null}
            </div>
        )
    }
}
