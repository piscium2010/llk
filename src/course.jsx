import React from 'react'
import './course.less'
import Icon from './icons'
import { Command, CommandBar, Link } from './common'
import Message from './alerts'
import Loading from './loading'
import { saveCourse, getCourse, CODE } from './api'

export default class Course extends React.Component {

    constructor(props) {
        super(props)
        this.textRef = null
        this.nameRef = null
        this.state = {
            courseId: props.match.params.courseId === 'new' ? '' : props.match.params.courseId,
            courseName: '',
            words: 'gorgeous\nadj.极好的',
            message: null,
            messageType: 'alert-success',
            loading: true
        }

        this.onTextChange = this.onTextChange.bind(this)
        this.onSaveCourse = this.onSaveCourse.bind(this)
    }

    componentDidMount() {
        getCourse(this.state.courseId).then(({courseId, courseName, words})=>{

            words = words ? words : this.state.words
            courseName = courseName ? courseName : this.state.courseName

            this.setState({
                loading: false,
                courseName,
                words
            }, () => {
                this.textRef.value = words
                this.nameRef.value = courseName
            })
        })
    }

    render() {
        return (
            <div className="course">
                <div className="main">
                    <div className="title">Course Name</div>
                    <div className="smalltri" id="one"></div>
                    <div className="section1">
                        <input ref={ref => this.nameRef = ref} 
                            className="input-title" 
                            type='text' name="courseName" 
                            placeholder="Course Name Here" 
                            value={this.state.courseName} 
                            onChange={this.onTextChange}
                        />
                    </div>
                    <textarea ref={ref => this.textRef = ref} 
                        className="section2" 
                        name="words" 
                        id="words" 
                        cols="100" 
                        rows="80"
                        onChange={this.onTextChange}
                        value={this.state.words}
                    />
                    <CommandBar>
                        <Command onClick={this.onSaveCourse}>
                            <Icon name='save' width={28} height={28} />
                        </Command>
                        <Link to='back'>
                            <Command>
                                <Icon name='back' width={28} height={28} />
                            </Command>
                        </Link>
                    </CommandBar>
                </div>
                <Message message={this.state.message} type={this.state.messageType} onAnimationEnd={()=>this.setState({message:null})} />
                <Loading show={this.state.loading} />
            </div>
        )
    }

    onTextChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    onSaveCourse(evt) {
        this.setState({
            loading: true
        })
        let { courseId, courseName, words } = this.state

        saveCourse(courseId, courseName, words).then(res=>{
            let message, messageType
            switch(res) {
                case CODE.DONE:
                    message = 'successful'
                    messageType = 'alert-success'
                    break
                case CODE.NOT_LOGIN:
                    message = 'Please log in to enable this feature'
                    messageType = 'alert-danger'
                    break
                default:
                    console.error('courses save',res);
                    message = 'failed'
                    messageType = 'alert-danger'
            }
            this.setState({
                message,
                messageType
            })

        }).finally(()=>{
            this.setState({
                loading: false
            })
        })
    }

}