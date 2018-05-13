import { CODE } from './constants'
import { addUser, findUser, addUserLink, saveUser, getLink, getCourses, getCourse, saveCourse } from './db'
import { getRandomCode } from './util'
import { sendMail } from './email'
import templates from './templates'

const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Content-Type', 'text/plain')
    next();
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + (20 * 86400 * 1000))
}))



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const site = 'llk'
const apiHost = 'http://localhost:3000/llk'


app.get(`/${site}/`, (req, res) => {
    console.log(`session`, req.session)
    res.send('hello srts')
})

//user links
app.get(`/${site}/links`, (req, res) => {
    console.log(`links`,req.query)
    let code = req.query.code
    let msg = ''
    getLink(code).then(({email, type, password})=>{
        if(email) {
            console.log(`result.type`,type)
            switch(type) {
                case 'activate' :
                    msg = 'your account has been activated'
                    return saveUser({email},{active:true})
                case 'reset' :
                    msg = 'your password has been reset'
                    return saveUser({email},{password})
                default:
                    return Promise.reject()
            }
        }
    }).then(()=>{
        res.header('Content-Type', 'text/html')
        res.send(templates.notification.replace('{$content}',`<p>${msg}</p>`))
    }).catch(err=>{
        console.log(`err`,err)
        res.send(CODE.ERROR)
    })
})

//get course
app.get(`/${site}/course`, (req, res) => {
    let email = req.session.uid
    //console.log(`server course session`,req.session)
    let courseId = req.query.courseId

    getCourse(courseId, email).then(course => {
        console.log(`server course`,course)
        res.send(JSON.stringify(course || {}))
    })
})

//get courses
app.get(`/${site}/courses`, (req, res) => {
    let email = req.session.uid
    console.log(`server courses session`,req.session)

    getCourses(email).then(courses => {
        if(courses && courses.length) {
            res.send(JSON.stringify(courses.map(c => ({name:c.courseName, id: c._id}))))
        }
        else {
            res.send(JSON.stringify([{name:'examples', id:'example'}]))
        }
    })
})

app.put(`/${site}/addcourse`, (req, res) => {
    let courseName = req.body.courseName
    res.send('add cd')
})

app.post(`/${site}/saveCourse`, (req, res) => {
    let { courseId, courseName, words } = req.body
    let uid = req.session.uid
    console.log(`server save course`,uid, courseId, courseName, words)

    if(!uid) {
        res.send(CODE.NOT_LOGIN)
    }
    else{
        saveCourse(courseId, uid, courseName, words).then(()=>{
            res.send(CODE.DONE)
        }).catch(err=>{
            console.error(err)
            res.send(CODE.ERROR)
        })
    }
})

//login
app.post(`/${site}/login`, (req, res) => {
    let { email, password } = req.body
    //console.log(`server login`,email, password)
    findUser(email).then(user => {
        //console.log(`server login`,user)
        //console.log(`server login password`,password)
        if(!user) {
            res.send(CODE.WRONG_CREDENTIAL)
            return
        }

        if(!user.active) {
            res.send(CODE.NOT_ACTIVE)
            return
        }

        if(password.trim() !== user.password.trim()) {
            console.log(``,password.trim(),user.password.trim())
            res.send(CODE.WRONG_CREDENTIAL)
            return
        }

        req.session.uid = email
        console.log(`login session`,req.session)
        res.send(CODE.DONE)
    })
})

app.post(`/${site}/logout`,(req, res)=>{
    req.session.uid = ''
    res.send(CODE.DONE)
})

app.post(`/${site}/addcourse`, (req, res) => {
    console.log(`param`, req.body)
    res.send('add')
})

app.post(`/${site}/register`, (req, res) => {
    let { email, password } = req.body

    findUser(email).then(result => {
        if(result) {
            if(result.active) {
                res.send(CODE.EMAIL_EXISTED)
            }
            else {
                res.send(CODE.NOT_ACTIVE)
            }
            return
        }

        addUser(email, password).then(() => {
            return addUserLink(email, 'activate')
        }).then(code => {
            //send activate link
            return new Promise((resolve, reject) => {
                let html = `<p>Please click below link to activate your account</p><p><a href='${apiHost}/links?code=${code}'>Activate account</a></p>`
                sendMail(email, 'Please activate your account', templates.notification.replace('{$content}',html), function (err, info) {
                    if (err) { reject(err) }
                    resolve()
                })
            })
        }).then(() => {
            res.send(CODE.DONE)
        }).catch(err => {
            console.log(`err`,err)
            res.send(CODE.ERROR)
        })
    })
})

app.post(`/${site}/reset`,(req,res) => {
    let { email, password } = req.body

    findUser(email).then(result => {
        //email not found
        if(!result) {
            res.send(CODE.EMAIL_NOT_FOUND)
            return
        }

        addUserLink(email, 'reset',{password}).then(code=>{
            let html = `<p>Please click below link to reset your password</p><p><a href='${apiHost}/links?code=${code}'>Confirm reset</a></p>`
            sendMail(email, 'Please confirm reset password', templates.notification.replace('{$content}',html), function (err, info) {
                if (err) { reject(err) }
                resolve()
            })
        }).then(()=>{
            res.send(CODE.DONE)
        })
    })

    
})

export default app

