import React from 'react'
import { Link } from './common'
import './home.less'


export default class Home extends React.Component {
    render() {
        return (
            <div className="home-main">
                <Link style={{ textDecorationLine: 'none' }} to="/llk/courses">
                    <button className="home-button">
                        <span>Play</span>
                    </button>
                </Link>
            </div>
        )
    }
}