import React from 'react'
import Icon from './icons'
import './courses.less'
import { getCourses, addCourse } from './api'
import Loading from './loading'
import { InlineCommand, Command, CommandBar } from './common'
import { Link } from './common'

const CourseItem = props => <Link to={`/game/${props.name}`}>
    <li>
        {props.name}
        {
            props.edit && <Link to={`/courses/${props.name}`}>
                <InlineCommand>
                    <Icon name='edit' width={24} height={24} />
                </InlineCommand>
            </Link>
        }
    </li>
</Link>

export default class Courses extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            courses: [],
            edit: false,
            loading: true
        }

        this.onAddCourse = this.onAddCourse.bind(this)
        this.onEditCourse = this.onEditCourse.bind(this)
    }
    componentDidMount() {
        getCourses().then(courses => this.setState({
            courses,
            loading: false
        }))
    }

    render() {
        return (
            <div className="courses">
                <div className="main">
                    <ul className="rolldown-list">
                        {
                            this.state.courses.map(c => (<CourseItem key={c} name={c} edit={this.state.edit} />))
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
            </div>
        )
    }

    onAddCourse() {
        this.setState({loading:true})
        addCourse().then(courses => {
            this.setState({
                courses,
                loading: false
            })
        })
    }

    onEditCourse() {
        this.setState({edit:!this.state.edit})
    }
}