import React from 'react'
import Icon from './icons'
import './courses.less'
import { getCourses, addCourse } from './api'
import Loading from './loading'
import { InlineCommand, Command, CommandBar } from './common'
import { Link } from './common'
import Login from './login'
import { app } from './api'
import Message from './alerts'
import { withRouter } from 'react-router'

const CourseItem = props => <Link to={`game/${props.courseId}`}>
    <li>
        {props.courseName || 'NEW'}
        {
            props.edit && <Link to={`courses/${props.courseId}`}>
                <InlineCommand>
                    <Icon name='edit' width={24} height={24} />
                </InlineCommand>
            </Link>
        }
    </li>
</Link>

class Courses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            edit: false,
            loading: true,
            showLogin: false,
            message: null,
            messageType: 'alert-primary'
        }

        this.onAddCourse = this.onAddCourse.bind(this)
        this.onEditCourse = this.onEditCourse.bind(this)
        this.doWhenLogin = this.doWhenLogin.bind(this)
    }
    componentDidMount() {
        getCourses().then(courses => {
            this.setState({
                courses,
                loading: false
            })
        })
    }

    doWhenLogin(action) {
        if (app.getUserId()) {
            action()
        }
        else {
            this.setState({ message: 'Please Sign in to enable this feature' })
        }
    }

    onAddCourse() {
        this.doWhenLogin(()=>{
            this.props.history.push('/llk/courses/new')
        })
    }

    onEditCourse() {
        this.doWhenLogin(()=>{
            this.setState({edit:!this.state.edit})
        })
    }

    render() {
        const { showLogin } = this.state

        return (
            <div className="courses">
                <div className="main">
                    <ul className="rolldown-list">
                        {
                            this.state.courses.map(c => (<CourseItem key={c.id || 1} courseName={c.name} courseId={c.id} edit={this.state.edit} />))
                        }
                    </ul> 
                    <CommandBar>
                        <Command onClick={this.onAddCourse}>
                            <Icon name='add' width={28} height={28} />
                        </Command>
                        <Command onClick={this.onEditCourse}>
                            <Icon name='set' width={28} height={28} />
                        </Command>
                    </CommandBar>
                </div>
                <Loading show={this.state.loading} />
                <Message message={this.state.message} type={this.state.messageType} onClose={()=>this.setState({message:null})}/>
            </div>
        )
    }
}

export default withRouter(Courses)

