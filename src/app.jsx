import React from 'react'
import classnames from 'classnames'
import { shuffle } from 'lodash'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Home from './home'
import Courses from './courses'
import Loading from './loading'
import Course from './course'
import Message from './alerts'
import GameLoader from './game'
import Login from './login'
import Nav from './nav'



export default class App extends React.Component{
    
    render() {
        return (
            <Router>
                <React.Fragment>
                    <Route exact path="/llk" component={Home} />
                    <Route path="/llk/" component={Nav} />
                    <Route path="/llk/login" component={Login} />
                    <Route path="/llk/courses/:name" component={Course} />
                    <Route exact path="/llk/courses" component={Courses} />
                    <Route path="/llk/game/:name" component={GameLoader}/>
                    {/* <Game data={loadData()} /> */}
                </React.Fragment>
            </Router>
        )
    }
}


function getPage() {
    let data = loadData()

}

function loadData() {
    let arr = []
        data.forEach((d,i) => {
            arr.push(
                {
                    text: d.name,
                    linkId: i
                }
            )
            arr.push(
                {
                    text: d.value,
                    linkId: i
                }
            )
        })
    return arr
}

