import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { BrowserRouter as Router, Link } from "react-router-dom"
import safe from './../images/safe.png'
import dangerous from './../images/dangerous.png'
import swimming from './../images/swimming.png'
import noSwimming from './../images/noSwimming.png'

export default class BookmarkCard extends Component {

    showDetails = () => {
        let waterBody = {
            "waterBodyId": this.props.bookmark[0],
            "name": this.props.bookmark[6],
            "country": this.props.bookmark[2],
            "type": this.props.bookmark[8],
            "picture": this.props.bookmark[7],
            "video": this.props.bookmark[10],
            "dangerous": this.props.bookmark[4],
            "allowSwimming": this.props.bookmark[1],
            "description": this.props.bookmark[5],
            "user": { "id": this.props.bookmark[11] },
            "comments": [],
            "bookmarks": []
        }
        this.props.showDetails(waterBody)
    }

    render() {
        return (
            <Card className="cards">
                <Card.Img variant="top" src={this.props.bookmark[7]} />
                <Card.Body>
                    <Card.Title>
                    <span>{this.props.bookmark[4] ? <img width="16px" src={dangerous} /> : <img width="25px" src={safe} />}</span> {' '}
                        <span>{this.props.bookmark[1] ? <img width="20px" src={swimming} /> : <img width="20px" src={noSwimming} />}</span> {' '}
                        <Router>
                            <Link to="/fatimah-al-ibrahim/WonderWater-Front-End/waterbody/details">
                                <span onClick={this.showDetails}>{this.props.bookmark[6]} {this.props.bookmark[8]}</span>
                            </Link>
                        </Router>
                        <br/><br/>
                        <p className="bookmarkCountry">In {this.props.bookmark[2]}</p>
                        <button className="btn-style btn-block" onClick={() => this.props.deleteBookmarkHandler(this.props.bookmark[12])}>Remove Bookmark</button>
                    </Card.Title>
                </Card.Body>
            </Card>
        )
    }
}
