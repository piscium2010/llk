import React from 'react'
import classnames from 'classnames'
import './login.less'
import { register, CODE, findUser, login, app } from './api'
import Loading from './loading'
import Message from './alerts'
import { withRouter } from 'react-router'

class InputField extends React.Component {
    static defaultProps = {
        onBlur: function() {}
    }

    constructor(props) {
        super(props)
        this.state = {
            focus: false
        }
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }

    render() {
        const { label, type, className, errorMsg, onBlur, ...restProps } = this.props
        const _classname = classnames({
            focus: this.state.focus
        })

        return(
            <div className={`${className} ${_classname}`}>
                <label>{label}</label>
                <input type={type}
                    className="input-field" 
                    onFocus={this.onFocus} 
                    onBlur={this.onBlur}
                    {...restProps}
                />
                <u></u>
                <div className='error'>{errorMsg}</div>
            </div>
        )
    }

    onFocus(evt) {
        this.setState({focus:true})
    }

    onBlur(evt) {
        if(!evt.target.value) {
            this.setState({focus:false})
        }
        else {
            this.props.onBlur(evt)
        }
    }
}

class Login extends React.Component {
    static defaultProps = {
        onClose: function() {},
        onLogin: function() {},
        show: false
    }

    constructor(props) {
        super(props)
        this.state = {
            level: 'level-login',

            login_email: '',
            login_password: '',
            login_emailErrorMsg: '',
            login_passwordErrorMsg: '',

            register_email: '',
            register_password: '',
            register_repeatPassword: '',
            register_emailErrorMsg: '',
            register_passwordErrorMsg: '',
            register_repeatPasswordErrorMsg: '',

            reset_email: '',
            reset_emailErrorMsg: '',

            loading: false,
            message: null
        }

        this.formBoxRef = React.createRef()

        this.onClickRegister = this.onClickRegister.bind(this)
        this.onClickForgot = this.onClickForgot.bind(this)
        this.onClickBack = this.onClickBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmitRegister = this.onSubmitRegister.bind(this)
        this.onEmailBlur = this.onEmailBlur.bind(this)
        this.onRepeatPasswordBlur = this.onRepeatPasswordBlur.bind(this)
        this.validateOnLogin = this.validateOnLogin.bind(this)
        this.validateOnRegister = this.validateOnRegister.bind(this)
        this.onConfirmRegister = this.onConfirmRegister.bind(this)
        this.onClickResetPassword = this.onClickResetPassword.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onClickLogin = this.onClickLogin.bind(this)
    }

    onEmailBlur(name) {
        return evt => {
            let email = this.state[name]
            let r = new RegExp(/^(\d|\w)+@(\d|\w)+\.\w+$/,'i')
            if(email) {
                this.setState({
                    [name + 'ErrorMsg']: r.test(email)? '':'Invalid email address'
                })
            }
        }
    }

    onRepeatPasswordBlur(evt) {
        let { register_password, register_repeatPassword } = this.state
        if(register_password && register_repeatPassword) {
            this.setState({
                register_repeatPasswordErrorMsg: register_password === register_repeatPassword ? '':'Password is not same'
            })
        }
    }

    validateOnRegister() {
        let { register_email, register_password, register_repeatPassword, register_emailErrorMsg, register_repeatPasswordErrorMsg } = this.state

        if(register_emailErrorMsg || register_repeatPasswordErrorMsg) {
            return false
        }

        if(!register_email || !register_password || !register_repeatPassword) {
            this.setState({
                shakeEmail: register_email? false : true,
                shakePassword: register_password? false : true,
                shakeRepeatPassword: register_repeatPassword ? false : true
            },()=>{
                setTimeout(() => {
                    this.setState({
                        shakeEmail: false,
                        shakePassword: false,
                        shakeRepeatPassword: false
                    })
                }, 1500);
            })
            return false
        }

        return true
    }

    validateOnLogin() {
        let { login_email, login_password, login_emailErrorMsg } = this.state

        if(login_emailErrorMsg) {
            return false
        }

        if(!login_email || !login_password) {
            this.setState({
                shakeEmail: login_email? false : true,
                shakePassword: login_password? false : true,
            },()=>{
                setTimeout(() => {
                    this.setState({
                        shakeEmail: false,
                        shakePassword: false
                    })
                }, 1500);
            })
            return false
        }

        return true
    }

    onClickRegister() {
        this.setState({
            level: this.state.level === 'level-login' ? 'level-reg' : 'level-login'
        })
    }

    onClickLogin(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        let valid = this.validateOnLogin()
        if(!valid) return

        let email = this.state.login_email
        let password = this.state.login_password

        this.setState({loading:true})

        login(email, password).then(res => {
            switch(res) {
                case CODE.DONE:
                    //app.email = email
                    //console.log(`login app.email set tt`)
                    //localStorage.setItem('email','tt')
                    //app.setItem('email',email)
                    //this.props.onClose()
                    this.props.history.goBack()
                    break
                case CODE.WRONG_CREDENTIAL:
                    this.setState({
                        message: 'Incorrect username or password',
                        messageType: 'alert-danger'
                    })
                    //this.setState({login_emailErrorMsg:'Incorrect username or password'})
                    break
                default:
                    console.error('login login',res)
                    break;
            }
        }).finally(()=>{
            this.setState({loading:false})
        })
    }

    onSubmitRegister() {
        let isvalid = this.validateOnRegister()
        if(isvalid) {
            let email = this.state.register_email
            let password = this.state.register_password
            this.setState({loading:true})
            
            register(email, password).then(
                res => {
                    if(res === CODE.EMAIL_EXISTED) {
                        this.setState({
                            //register_emailErrorMsg:'Email is already registered'
                            message: 'Email is already registered',
                            messageType: 'alert-danger'
                        })
                    }
                    else if(res === CODE.NOT_ACTIVE) {
                        this.setState({
                            //register_emailErrorMsg:'Your account is not active'
                            message: 'Your account is not active',
                            messageType: 'alert-danger'
                        })
                    }
                    else if(res === CODE.DONE) {
                        this.setState({
                            register_email: '',
                            register_password: '',
                            register_repeatPassword: '',
                            level: 'level-reg-link'
                        })
                    }
                }
            ).catch(error => {
                console.log(`error`,error)
            }).finally(
                () => this.setState({loading:false})
            )
        }
    }

    // handleResponse(res) {
    //     console.log(`login res`,res)
    //     if(res === CODE.EMAIL_EXISTED) {
    //         this.setState({
    //             register_emailErrorMsg:'Email is already registered'
    //         })
    //     }
    //     else if(res === CODE.NOT_ACTIVE) {
    //         this.setState({
    //             register_emailErrorMsg:'Your account is not active'
    //         })
    //     }
    //     else if(res === CODE.DONE) {
    //         this.setState({
    //             register_email: '',
    //             register_password: '',
    //             register_repeatPassword: '',
    //             level: 'level-reg-link'
    //         })
    //     }
    // }

    onClickForgot(evt) {
        evt.preventDefault()
        this.setState({
            level: 'level-forget'
        })
    }

    onClickBack(evt) {
        evt.preventDefault()
        this.setState({
            level: 'level-login'
        })
    }

    onConfirmRegister(evt) {
        this.setState({
            level: 'level-login'
        })
    }

    onClickResetPassword(evt) {
        this.setState({
            level: 'level-forget-link'
        })
    }

    onChange(name) {
        return evt => {
            this.setState({
                [name]: evt.target.value
            })
        }
    }

    onClose(evt) {
        if(evt.target === evt.currentTarget) {
            //this.props.onClose(evt)
            this.props.history.goBack()
        }
    }

    render() {
        let { show } = this.props
        let formBoxClassName = classnames({
            formBox: true,
            "level-login": this.state.level === 'level-login',
            "level-reg": this.state.level === 'level-reg',
            'level-reg-link': this.state.level === 'level-reg-link',
            "level-forget": this.state.level === 'level-forget',
            'level-forget-link': this.state.level === 'level-forget-link'
        })

        return(
                <div className="login" onClick={this.onClose}>
                <Loading show={this.state.loading} />
                <Message message={this.state.message} type={this.state.messageType} onAnimationEnd={()=>this.setState({message:null})} />
                    <div className={formBoxClassName}>
                        <div className="box boxShaddow"></div>  
                        <div className="box loginBox">
                        <h2>LOGIN</h2>
                        <form className="form">
                            <InputField label={'Email'} 
                                className={`f_row ${this.state.shakeEmail?'shake':''}`} 
                                type='text' 
                                onChange={this.onChange('login_email')} 
                                errorMsg={this.state.login_emailErrorMsg}
                                onBlur={this.onEmailBlur('login_email')}
                                value={this.state.login_email}
                            />
                            <InputField label={'Password'} 
                                className={`f_row last ${this.state.shakePassword?'shake':''}`} 
                                type='password' 
                                onChange={this.onChange('login_password')} 
                                errorMsg={this.state.login_passwordErrorMsg}
                                value={this.state.login_password}
                            />
                            <button className="btn" onClick={this.onClickLogin}>
                                <span>GO</span>
                            </button>
                            <div className="f_link">
                                <a href="#" className="resetTag" onClick={this.onClickForgot} >Forgot your password?</a>
                            </div>
                        </form>
                        </div>
                        <div className="box forgetbox">
                            <a href="#" className="back icon-back" onClick={this.onClickBack} >
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 199.404 199.404" style={{"enable-background":"new 0 0 199.404 199.404"}} xmlSpace="preserve">
                                    <polygon points="199.404,81.529 74.742,81.529 127.987,28.285 99.701,0 0,99.702 99.701,199.404 127.987,171.119 74.742,117.876 199.404,117.876 "/>
                                </svg>
                            </a>
                            <h2>Reset Password</h2>
                            <form className="form">
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
                                <InputField label={'Email'} 
                                    className={`f_row last ${this.state.shakeEmail?'shake':''}`} 
                                    type='text' 
                                    onChange={this.onChange('reset_email')} 
                                    errorMsg={this.state.reset_emailErrorMsg}
                                    onBlur={this.onEmailBlur('reset_email')}
                                    value={this.state.reset_email}
                                />
                                <button className="btn" onClick={this.onClickResetPassword}>
                                    <span>Reset</span>
                                </button>
                            </form>
                        </div>
                        <div className="box forgetLinkBox">
                            <a href="#" className="back icon-back" onClick={this.onClickBack} >
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 199.404 199.404" style={{"enable-background":"new 0 0 199.404 199.404"}} xmlSpace="preserve">
                                    <polygon points="199.404,81.529 74.742,81.529 127.987,28.285 99.701,0 0,99.702 99.701,199.404 127.987,171.119 74.742,117.876 199.404,117.876 "/>
                                </svg>
                            </a>
                            <h2>Reset Password</h2>
                            <form className="form">
                                <p>A link has been sent to your email. Please visit your email to reset password.</p>
                                <button className="btn">
                                    <span>OK</span>
                                </button>
                            </form>
                        </div>
                        <div className="box registerBox">
                            <span className="reg_bg"></span>
                            <h2>Register</h2>
                            <form className="form">
                                <InputField label={'Email'}
                                    className={`f_row ${this.state.shakeEmail ? 'shake' : ''}`}
                                    type='text'
                                    onChange={this.onChange('register_email')}
                                    errorMsg={this.state.register_emailErrorMsg}
                                    onBlur={this.onEmailBlur('register_email')}
                                    value={this.state.register_email}
                                />
                                <InputField label={'Password'}
                                    className={`f_row ${this.state.shakePassword ? 'shake' : ''}`}
                                    type='password'
                                    onChange={this.onChange('register_password')}
                                    errorMsg={this.state.register_passwordErrorMsg}
                                    value={this.state.register_password}
                                />
                                <InputField label={'Repeat Password'}
                                    className={`f_row last ${this.state.shakeRepeatPassword ? 'shake' : ''}`}
                                    type='password'
                                    onChange={this.onChange('register_repeatPassword')}
                                    errorMsg={this.state.register_repeatPasswordErrorMsg}
                                    onBlur={this.onRepeatPasswordBlur}
                                    value={this.state.register_repeatPassword}
                                />
                                <button className="btn-large" onClick={this.onSubmitRegister}>Go</button>
                            </form>
                        </div>
                        <div className="box registerLinkBox">
                            <span className="reg_bg"></span>
                            <h2>Register</h2>
                            <p>A link has been sent to your email. Please visit your email to activate your account.</p>
                            <button className="btn-large" onClick={this.onConfirmRegister}>Ok</button>
                        </div>
                        <a href="#" className="regTag icon-add" onClick={this.onClickRegister}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" style={{"enable-background":"new 0 0 357 357"}} xmlSpace="preserve">
                                <path d="M357,204H204v153h-51V204H0v-51h153V0h51v153h153V204z"/>
                            </svg>
                        </a>
                    </div>
            </div>

        )
    }
}

export default withRouter(Login)
