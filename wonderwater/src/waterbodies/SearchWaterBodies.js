import React, { Component } from 'react'
import axios from 'axios';
import { FormControl } from 'react-bootstrap';
import { BrowserRouter as Router, Link } from "react-router-dom";

export default class SearchWaterBodies extends Component {

    constructor(props) {
        super(props)

        this.state = {
            waterBodies: this.props.waterBodies,
            filterResult: null,
            filterValue: ""
        }
    }

    componentDidMount() {
        this.loadWaterBodies();
        setInterval(() => { this.loadWaterBodies() }, 60000);
    }

    loadWaterBodies = () => {
        axios.get("/wonderwater/waterbody/index")
            .then(response => {
                this.setState({
                    waterBodies: response.data
                })
            })
            .catch(error => {
                this.props.handleAlert("An error occurred while getting the water bodies for search. Please try again later","danger");
            })
    }

    changeHandler = (event) => {
        event.preventDefault();
        const filterValue = event.target.value;
        if (!filterValue) {
            this.setState({
                filterResult: null,
                filterValue: ""
            })
        } else {
            const filterResult = this.state.waterBodies.filter((waterBody) => {
                return waterBody.name.toLowerCase().includes(filterValue.toLowerCase())
            })
            this.setState({
                filterResult: filterResult,
                filterValue: filterValue
            })
        }
    }

    handleClick = (waterBody) => {
        this.setState({
            filterResult: null,
            filterValue: ""
        })
        this.props.detailWaterBodyChangeHandler(waterBody)
    }

    render() {
        return (
            <div style={{ position: "relative", top: "13%" }}>
                <FormControl style={{ position: "relative", top: "13%" }} type="text" value={this.state.filterValue} placeholder="Search" onChange={this.changeHandler} />
                {this.state.filterResult ?
                    <div className="searchResult">
                        <Router>
                            {this.state.filterResult.map((waterBody, index) =>
                                <p key={index}>
                                    <Link to="/waterbody/details" onClick={() => this.handleClick(waterBody)}>{waterBody.name} {waterBody.type}</Link>
                                </p>
                            )}
                        </Router>
                    </div>
                    : null}
            </div>
        )
    }
}
