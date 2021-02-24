import React, { Component } from 'react'
import { Card, Button } from 'react-bootstrap'

export default class BookmarkCard extends Component {
    render() {
        return (
            <div>
                <Card>
                    <Card.Img variant="top" src={this.props.bookmark[0]} />
                        <Card.Footer>
                            <Button variant="outline-primary" onClick={() => this.props.deleteBookmarkHandler(this.props.bookmark[1])}>Bookmarked</Button>
                        </Card.Footer>
                </Card>
            </div>
        )
    }
}
