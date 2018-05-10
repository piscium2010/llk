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
        //console.log(`evt.class`,evt.target.getAttribute('class'))
        let className = evt.target.getAttribute('class')
        if(className && className.indexOf('nav-dropdown-item') >= 0) { return }
        this.setState({showItems: !this.state.showItems})
    }

    render() {
        let children = React.Children.toArray(this.props.children)
        let Menu = children[0]
        let Items = children[1]
        
        return (
            <div className='nav-menu' onClick={this.toggle}>
                    {
                        React.cloneElement(Menu)
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
            this.props.history.push('/llk')
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
               
                <div className="app nav">
                    <ul>
                        <li>
                            {
                                app.getUserId() ? 
                                <Menu>
                                    <Icon width={28} height={28} name='account' />
                                    <div className="nav-dropdown-menu">
                                        <span className="nav-dropdown-item" onClick={this.logout}>Log out</span>
                                    </div>
                                </Menu>
                                : 
                                <Link to='/llk/login'><span className='nav-menu'>Sign in</span></Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Nav)