import React from 'react'
import './nav.less'
import Login from './login'
import classnames from 'classnames'
import { app } from './api'

export default class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false
        }

        this.signIn = this.signIn.bind(this)
        this.hideLogin = this.hideLogin.bind(this)
    }

    signIn(evt) {
        evt.preventDefault()
        this.setState({
            showLogin: true
        })
    }

    hideLogin() {
        this.setState({ showLogin: false })
    }

    render() {
        let mask = {
            mask:this.state.showLogin
        }
        console.log(`app.email`,app.email())
        return (
            <div className={classnames(mask)}>
                <Login show={this.state.showLogin} onClose={this.hideLogin} />
                <div className="app nav">
                    <ul>
                        <li><a href="#" onClick={this.signIn}>{app.email() ? 'Welcome' : 'Sign in'}</a></li>
                    </ul>
                </div>
            </div>
        )
    }
}