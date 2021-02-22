import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'

export default class WaterBody extends Component {

    render() {
        return (
            <div>
                waterbody details
                <Tabs transition={false} defaultActiveKey="picture">
                    <Tab eventKey="picture" title="Picture">
                        <img width="100%" height="400" src={this.props.waterBody.picture} />
                    </Tab>
                    <Tab eventKey="video" title="Video">
                        <iframe width="100%" height="400" src={this.props.waterBody.video} allowFullScreen /> :
                    </Tab>
                </Tabs>
                <h2>{this.props.waterBody.name}</h2>
                <p>Added By: {this.props.waterBody.user.firstName} {this.props.waterBody.user.lastName}</p>
                {this.props.waterBody.dangerous ? <p>Dangerous</p> : <p>Safe</p>}
                {this.props.waterBody.allowSwimming ? <p>Allow Swimming</p> : <p>Doesn't Allow Swimming</p>}
                <p>Country: {this.props.waterBody.country}</p>
                <p>Type: {this.props.waterBody.type}</p>
                <p>Description: {this.props.waterBody.description}</p>
            </div>
        )
    }
}
