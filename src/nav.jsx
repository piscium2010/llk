import React from 'react'
import './nav.less'
import Login from './login'
import classnames from 'classnames'
import { app, logout } from './api'
import { Link } from './common'
import Icon from './icons'
import { withRouter } from 'react-router'

class Menu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showItems: false
        }
        this.toggle = this.toggle.bind(this)
    }

    toggle(evt) {
        evt.preventDefault()
        if(evt.target === evt.currentTarget)
            this.setState({showItems: !this.state.showItems})
    }

    render() {
        let children = React.Children.toArray(this.props.children)
        let Menu = children[0]
        let Items = children[1]
        
        return (
            <div className='nav-menu'>
                {
                    React.cloneElement(Menu,{onClick:this.toggle})
                }
                {
                    this.state.showItems && Items
                }
            </div> 
        )
    }
}

class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false
        }

        this.signIn = this.signIn.bind(this)
        this.hideLogin = this.hideLogin.bind(this)
        this.logout = this.logout.bind(this)
    }

    signIn(evt) {
        evt.preventDefault()
        this.setState({
            showLogin: true
        })
    }

    logout(evt) {
        evt.preventDefault()
        console.log(`nav logout `,)
        logout().then(() => {
            console.log(`nav logout done`,)
            this.props.history.push('/')
        })
    }

    hideLogin() {
        this.setState({ showLogin: false })
    }

    render() {
        let mask = {
            mask:this.state.showLogin
        }
        return (
            <div className={classnames(mask)}>
                <Login show={this.state.showLogin} onClose={this.hideLogin} />
                <div className="app nav">
                    <ul>
                        <li>
                            {
                                app.email() ? 
                                <Menu>
                                    <Icon width={28} height={28} name='account' />
                                    <div className="nav-dropdown-menu">
                                        <a className="nav-dropdown-item" href="#" onClick={this.logout}>Log out</a>
                                    </div>
                                </Menu>
                                : 
                                <Link to='/login'><a href='#'>Sign in</a></Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Nav)