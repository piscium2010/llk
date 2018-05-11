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

const CourseItem = props => <Link to={`/llk/game/${props.courseId}`}>
    <li>
        {props.courseName}
        {
            props.edit && <Link to={`/llk/courses/${props.courseId}`}>
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
        this.onLogin = this.onLogin.bind(this)
    }
    componentDidMount() {
        // getCourses().then(courses => this.setState({
        //     courses,
        //     loading: false
        // }))
        getCourses().then(courses => {
            console.log(`courses courses`,courses)
            this.setState({
                courses,
                loading: false
            })
        })
    }

    onLogin() {
        // console.log(`courses login`,)
        // this.setState({loading:true, showLogin: false},()=>{
        //     getCourses().then(courses => this.setState({
        //         courses
        //     })).finally(()=>{
        //         this.setState({loading: false})
        //     })
        // })
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

    onAddCourse() {
        if (app.getUserId()) {
            // this.setState({ loading: true })
            // addCourse().then(courses => {
            //     this.setState({
            //         courses,
            //         loading: false
            //     })
            // })
            this.props.history.push('/llk/courses/new')
        }
        else {
            this.setState({ message: 'Please log in to enable this feature' })
        }
    }

    onEditCourse() {
        this.setState({edit:!this.state.edit})
    }
}

export default withRouter(Courses)