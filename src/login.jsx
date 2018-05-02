import React from 'react'
import classnames from 'classnames'
import './login.less'

export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usernameFocus: false,
            passwordFocus: false,
            repeatPasswordFocus: false,
            level_login: true,
            level_reg: false,
        }
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onClickRegister = this.onClickRegister.bind(this)
    }

    onFocus(name) {
        return evt => {
            this.setState({
                [name]:true
            })
        }
    }

    onBlur(name) {
        return evt => {
            if(!evt.target.value){
                this.setState({
                    [name]: false
                })
            }
        }
    }

    onClickRegister() {
        this.setState({
            level_login: !this.state.level_login,
            level_reg: !this.state.level_reg
        })
    }

    render() {
        let userNameClassName = classnames({
            f_row: true,
            focus: this.state.usernameFocus
        })

        let passwordClassName = classnames({
            f_row: true,
            focus: this.state.passwordFocus
        })
        let repeatPasswordClassName = classnames({
            f_row: true,
            focus: this.state.repeatPasswordFocus
        })

        let formBoxClassName = classnames({
            formBox: true,
            "level-login": this.state.level_login,
            "level-reg": this.state.level_reg,
            "level-reg-reverse": this.state.level_reg

        })

        return(
            <div className="login">
                <div className="container">
                    <div className={formBoxClassName}>
                        <div className="box boxShaddow"></div>  
                        <div className="box loginBox">
                        <h2>LOGIN</h2>
                        <form className="form">
                            <div className={userNameClassName}>
                            <label>Username</label>
                            <input type="text" className="input-field" required onFocus={this.onFocus('usernameFocus')} onBlur={this.onBlur('usernameFocus')}/>
                            <u></u>
                            </div>
                            <div className={`${passwordClassName} last`}>
                            <label>Password</label>
                            <input type="password" className="input-field" required onFocus={this.onFocus('passwordFocus')} onBlur={this.onBlur('passwordFocus')}/>
                            <u></u>
                            </div>
                            <button className="btn"><span>GO</span><u></u>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 415.582 415.582" xmlSpace="preserve">
                                                    <path d="M411.47,96.426l-46.319-46.32c-5.482-5.482-14.371-5.482-19.853,0L152.348,243.058l-82.066-82.064
                                                        c-5.48-5.482-14.37-5.482-19.851,0l-46.319,46.32c-5.482,5.481-5.482,14.37,0,19.852l138.311,138.31
                                                        c2.741,2.742,6.334,4.112,9.926,4.112c3.593,0,7.186-1.37,9.926-4.112L411.47,116.277c2.633-2.632,4.111-6.203,4.111-9.925
                                                        C415.582,102.628,414.103,99.059,411.47,96.426z"/>
                                                    </svg>
                            </button>
                            <div className="f_link">
                            <a href="" className="resetTag">Forgot your password?</a>
                            </div>
                        </form>
                        </div>
                        <div className="box forgetbox">
                        <a href="#" className="back icon-back">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 199.404 199.404" style={{"enable-background":"new 0 0 199.404 199.404"}}
                        xmlSpace="preserve">
                        <polygon points="199.404,81.529 74.742,81.529 127.987,28.285 99.701,0 0,99.702 99.701,199.404 127.987,171.119 74.742,117.876 
                            199.404,117.876 "/>
                    </svg>
                        </a>
                        <h2>Reset Password</h2>
                        <form className="form">
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
                            <div className="f_row last">
                            <label>Email Id</label>
                            <input type="text" className="input-field" required/>
                            <u></u>
                            </div>
                            <button className="btn"><span>Reset</span><u></u>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 415.582 415.582" xmlSpace="preserve">
                                                    <path d="M411.47,96.426l-46.319-46.32c-5.482-5.482-14.371-5.482-19.853,0L152.348,243.058l-82.066-82.064
                                                        c-5.48-5.482-14.37-5.482-19.851,0l-46.319,46.32c-5.482,5.481-5.482,14.37,0,19.852l138.311,138.31
                                                        c2.741,2.742,6.334,4.112,9.926,4.112c3.593,0,7.186-1.37,9.926-4.112L411.47,116.277c2.633-2.632,4.111-6.203,4.111-9.925
                                                        C415.582,102.628,414.103,99.059,411.47,96.426z"/>
                                                    </svg>
                            </button>
                        </form>
                        </div>
                        <div className="box registerBox">
                        <span className="reg_bg"></span>
                        <h2>Register</h2>
                        <form className="form">
                            <div className={userNameClassName}>
                                <label>Username</label>
                                <input type="text" className="input-field" required onFocus={this.onFocus('usernameFocus')} onBlur={this.onBlur('usernameFocus')}/>
                                <u></u>
                            </div>
                            <div className={`${passwordClassName}`}>
                            <label>Password</label>
                            <input type="password" className="input-field" required onFocus={this.onFocus('passwordFocus')} onBlur={this.onBlur('passwordFocus')}/>
                            <u></u>
                            </div>
                            <div className={`${repeatPasswordClassName} last`}>
                            <label>Repeat Password</label>
                            <input type="password" className="input-field" required onFocus={this.onFocus('repeatPasswordFocus')} onBlur={this.onBlur('repeatPasswordFocus')}/>
                            <u></u>
                            </div>
                            <button className="btn-large">NEXT</button>
                        </form>
                        </div>
                        <a href="#" className="regTag icon-add" onClick={this.onClickRegister}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" style={{"enable-background":"new 0 0 357 357"}} xmlSpace="preserve">
                                <path d="M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z"/>
                            </svg>

                        </a>
                    </div>
                </div>
            </div>

        )
    }
}