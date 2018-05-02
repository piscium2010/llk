import React from 'react'
import './course.less'
import Icon from './icons'
import { Command, CommandBar, Link } from './common'
import Message from './alerts'
import Loading from './loading'
import { saveCourse, getCourse } from './api'

export default class Course extends React.Component {

    constructor(props) {
        super(props)
        this.textRef = null
        this.state = {
            courseName: props.match.params.name,
            words: '',
            message: null,
            loading: true
        }

        this.onTextChange = this.onTextChange.bind(this)
        this.onSaveCourse = this.onSaveCourse.bind(this)
    }

    componentDidMount() {
        getCourse(this.state.courseName).then(words=>{
            words = words ? words : 'gorgeous\nadj.极好的'

            this.setState({
                loading: false,
                words
            },()=>{
                this.textRef.value = words
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
                        <input className="input-title" name="courseName" placeholder="Course Name Here" value={this.state.courseName} onChange={this.onTextChange}/>
                    </div>
                    <textarea ref={ref => this.textRef = ref} className="section2" name="words" id="words" cols="100" rows="80"
                    onChange={this.onTextChange}/>
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
                <Message message={this.state.message} onAnimationEnd={()=>this.setState({message:null})} />
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

        saveCourse().then(()=>{
            this.setState({
                loading: false,
                message: 'successful'
            })
        })
    }

}