import React from 'react'
import { Link } from 'react-router-dom'
import './home.less'


export default class Home extends React.Component {
    render() {
        return(
            <Link style={{textDecorationLine:'none'}} to="/courses">
                <div className="home-main">
                    <div className="home-button">
                        Start
                    </div>
                </div>
            </Link>
        )
    }
}