import React from 'react'
import classnames from 'classnames'
import './login.less'

class InputField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            focus: false
        }
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }

    render() {
        const { label, type, className, errorMsg, ...restProps } = this.props
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
    }
}

export default class Login extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            level_login: true,
            level_reg: false,
            level_forget: false,
            shakeIfEmpty: false,
            email: null,
            password: null,
            repeatPassword: null,
            emailErrorMsg: 'email is already registered',
            passwordErrorMsg: 'email is already registered',
            repeatPasswordErrorMsg: 'email is already registered'
        }

        this.formBoxRef = React.createRef()

        this.onClickRegister = this.onClickRegister.bind(this)
        this.onClickForgot = this.onClickForgot.bind(this)
        this.onClickBack = this.onClickBack.bind(this)
        this.onChange = this.onChange.bind(this)
        this.shakeIfEmpty = this.shakeIfEmpty.bind(this)
        this.onGo = this.onGo.bind(this)
        
    }

    onClickRegister() {
        this.setState({
            level_login: !this.state.level_login,
            level_reg: !this.state.level_reg
        })
    }

    onClickForgot(evt) {
        evt.preventDefault()
        this.setState({
            level_forget: true,
            level_reg: false
        })
    }

    onClickBack(evt) {
        evt.preventDefault()
        this.setState({
            level_forget: false,
            level_login: true
        })
    }

    onChange(name) {
        return evt => {
            this.setState({
                [name]: evt.target.value
            })
        }
    }

    onGo() {
        this.setState({
            shakeIfEmpty: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    shakeIfEmpty: false
                })
            }, 2000)
        })
    }

    shakeIfEmpty(name) {
        return !this.state.shakeIfEmpty || this.state[name] ? '' : 'shake'
    }


    render() {
        let formBoxClassName = classnames({
            formBox: true,
            "level-login": this.state.level_login,
            "level-reg": this.state.level_reg,
            "level-reg-reverse": this.state.level_reg,
            "level-forget": this.state.level_forget
        })

        return(
            <div className="login">
                <div className="container">
                    <div className={formBoxClassName}>
                        <div className="box boxShaddow"></div>  
                        <div className="box loginBox">
                        <h2>LOGIN</h2>
                        <form className="form">
                            <InputField label={'Email'} className={`f_row ${this.shakeIfEmpty('email')}`} type='text' onChange={this.onChange('email')} errorMsg={this.state.emailErrorMsg} />
                            <InputField label={'Password'} className={`f_row last ${this.shakeIfEmpty('password')}`} type='password' onChange={this.onChange('password')} errorMsg={this.state.passwordErrorMsg}/>
                            <button className="btn" onClick={this.onGo}>
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
                            <InputField label={'Email'} className={`f_row last ${this.shakeIfEmpty('email')}`} type='text' onChange={this.onChange('email')} errorMsg={this.state.emailErrorMsg}/>
                            <button className="btn">
                                <span>Reset</span>
                            </button>
                        </form>
                        </div>
                        <div className="box registerBox">
                        <span className="reg_bg"></span>
                        <h2>Register</h2>
                        <form className="form">
                            <InputField label={'Email'} className={`f_row ${this.shakeIfEmpty('email')}`} type='text' onChange={this.onChange('email')} errorMsg={this.state.emailErrorMsg}/>
                            <InputField label={'Password'} className={`f_row ${this.shakeIfEmpty('password')}`} type='password' onChange={this.onChange('password')} errorMsg={this.state.passwordErrorMsg}/>
                            <InputField label={'Repeat Password'} className={`f_row last ${this.shakeIfEmpty('repeatPassword')}`} type='password' onChange={this.onChange('repeatPassword')} errorMsg={this.state.repeatPasswordErrorMsg}/>
                            <button className="btn-large" onClick={this.onGo}>Go</button>
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
