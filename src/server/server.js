import { CODE } from './constants'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const site = 'llk'

app.get(`/${site}/`,(req, res)=>{
    console.log(`session`,req.session)
    req.session.uid = 'udi'
    res.send('hello srts')
})

app.put(`/${site}/addcourse`,(req, res)=>{
    let courseName = req.body.courseName
    // console.log(`addcourse session`,req.session)
    // console.log(`session.uid`,req.session.uid)
    // console.log(`session.uid`,req.session['uid'])

    res.send('add cdss')
})

app.post(`/${site}/addcourse`,(req, res)=>{
    console.log(`param`,req.body)
    res.send('add')
})

app.post(`/${site}/register`,(req, res)=>{
    console.log(`registe.body`,req.body)
    res.setHeader('Content-Type', 'text/plain')
    setTimeout(()=>{
        res.send(CODE.DONE)
    },3000)
})

export default app

