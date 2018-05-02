const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const session = require('express-session')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))


app.use(bodyParser.urlencoded({ extended: true }));
const site = 'llk'

app.get(`/${site}/`,(req, res)=>{
    console.log(`session`,req.session)
    req.session.uid = 'udi'
    res.send('hello srts')
})

app.put(`/${site}/addcourse`,(req, res)=>{
    let courseName = req.body.courseName
    console.log(`addcourse session`,req.session)
    console.log(`session.uid`,req.session.uid)
    console.log(`session.uid`,req.session['uid'])

    res.send('add cdss')
})

app.post(`/${site}/addcourse`,(req, res)=>{
    console.log(`param`,req.body)
    res.send('add')
})

export default app

