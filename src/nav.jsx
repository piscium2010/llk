import React from 'react'
import './nav.less'
import Login from './login'
import classnames from 'classnames'
import { app, logout } from './api'
import { Link } from './common'
import Icon from './icons'
import { withRouter } from 'react-router'

class Menu extends React.Component {
    static defaultProps = {
        onClick: function() {}
    }
    constructor(props) {
        super(props)
        this.dropdownRef = null
        this.state = {
            showItems: false
        }
        this.toggle = this.toggle.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }

    toggle(evt) {
        evt.preventDefault()
        this.setState({showItems: !this.state.showItems})
    }

    onBlur(evt) {
        this.setState({showItems:false})
    }

    render() {
        let children = React.Children.toArray(this.props.children)
        let menu = children[0]
        let items = children[1]
        let { onClick } = this.props
        
        return (
                <button className='nav-menu' onClick={items ? this.toggle : onClick} onBlur={this.onBlur}>
                {
                    React.cloneElement(menu)
                }
                {
                    this.state.showItems && items && <div className={`nav-dropdown-menu`}>{items}</div>
                }
                </button>
        )
    }
}

const RequireLogin = props => app.getUserId() ? props.children : null
const RequireLogout = props => app.getUserId() ? null : props.children

class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false
        }

        this.signIn = this.signIn.bind(this)
        //this.hideLogin = this.hideLogin.bind(this)
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

    render() {
        
        return (
                <div className="app nav">
                    <ul>
                        <RequireLogin>
                            <li style={{float:'left'}}>
                                <Menu>
                                    <span>{app.getUserId() || ''}</span>
                                </Menu>
                            </li>
                        </RequireLogin>
                        <li>
                            <RequireLogin>
                                <Menu>
                                    <Icon width={28} height={28} name='account' />
                                    <span className="nav-dropdown-item" onClick={this.logout}>Log out</span>
                                </Menu>
                            </RequireLogin>
                            <RequireLogout>
                                <Link to='/llk/login'><span className='nav-menu'>Sign in</span></Link>
                            </RequireLogout>
                        </li>
                        <RequireLogin>
                            <li>
                                <Link to='/llk/courses'>
                                    <Menu>
                                        <Icon width={28} height={28} name='viewGallery' />
                                    </Menu>
                                </Link>
                            </li>
                        </RequireLogin>
                    </ul>
                </div>
        )
    }
}

export default withRouter(Nav)