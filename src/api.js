import { words } from './example'
import { CODE } from './server/constants'
export { CODE } from './server/constants'
import { site, apiHost } from './server/config'


export const app = {
    setItem: function (key, value) {
        switch(typeof value) {
            case 'object':
                localStorage.setItem(key, JSON.stringify(value))
                break
            default:
                localStorage.setItem(key, value)
        }
    },
    email: function () {
        return localStorage.getItem('email')
    },
    getUserId: function () {
        try {
            let {email, expire} = JSON.parse(localStorage.getItem('email'))
            if(email && expire && new Date(expire) > new Date()) {
                return email
            }
            else {
                return ''
            }
        }
        catch(e) {
            return ''
        }
    }
}

const jsonHeader = { "Content-Type": "application/json" }

// const site = 'llk/api'
// const apiHost = `http://localhost:3000/${site}`

function myFetch(url, options) {
    return fetch(url, Object.assign({ credentials: 'include', headers: jsonHeader }, options))
}

function fetchText(url, options) {
    return fetch(url, Object.assign({ credentials: 'include', headers: jsonHeader }, options)).then(res => res.text())
}

function fetchJson(url, options) {
    return myFetch(url, options).then(res =>
        res.text().then(result => {
            try {
                console.log(`result`, JSON.parse(result))
                return JSON.parse(result)
            } catch (err) {
                console.error('api ', err);
                return Promise.reject()
            }
        }).catch(err => {
            throw err
        })
    )
}

export function getCourses() {
    if (app.getUserId()) {
        return fetchJson(`${apiHost}/courses`, {
            method: 'GET',
            headers: jsonHeader
        }).then(c => {
            console.log(`c`, c)
            return c
        })
    }

    return new Promise((res, rej) => {
        setTimeout(() => {
            console.log(`example`, )
            res([{ name: 'example', id: 'example' }])
        }, 1000)
    })
}

export function getCourse(courseId) {
    if (courseId === 'example') {
        return new Promise((res, rej) => {
            res({ name: 'example', id: 'example', words: words })
        })
    }
    if (courseId) {
        return fetchJson(`${apiHost}/course?courseId=${courseId}`, {
            method: 'GET'
        })
    }
    else {
        return new Promise((res, rej) => {
            res({})
        })
    }
    // console.log(`api get Course courseId`,courseId)
    // switch(courseId) {
    //     case 'example':
    //         return new Promise((res, rej) => {
    //             res({ name: 'example', id: 'example', words: words })
    //         })
    //         break
    //     case 'new':
    //         return new Promise((res, rej) => {
    //             res({})
    //         })
    //         break
    //     default:
    //         return fetchJson(`${apiHost}/course?courseId=${courseId}`, {
    //             method: 'GET'
    //         })
    // }
}

export function addCourse() {
    //return fetchJson(`${apiHost}/addCourse`)
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(['one', 'two', 'three', 'four', 'New'])
        }, 1000)
    })
}

export function saveCourse(courseId, courseName, words) {
    return fetchText(`${apiHost}/saveCourse`, {
        method: 'POST',
        body: JSON.stringify({
            courseId,
            courseName,
            words
        })
    })

    // return new Promise((res,rej)=>{
    //     setTimeout(()=>{
    //         res()
    //     },1000)
    // })
}

export function register(email, password) {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest()
        let data = JSON.stringify({
            email,
            password
        })

        xhttp.open('post', `${apiHost}/register`)
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")


        xhttp.onreadystatechange = function () {
            // check if the response data send back to us 
            if (xhttp.readyState === 4) {
                // check if the xhttp is successful
                if (xhttp.status === 200) {
                    resolve(xhttp.response)
                } else {
                    reject(xhttp.response)
                }
            }
        }
        // specify the type of xhttp
        xhttp.send(data)
    })
}

export function resetPassword(email, password) {
    console.log(`api reset`, email)
    return myFetch(`${apiHost}/reset`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }).then(
        res => res.text()
    ).catch(err => {
        console.error(err)
    })
}

export function findUser(email) {
    return myFetch(`${apiHost}/findUser?email=${email}`, { method: 'GET' })
}

export function login(email, password) {
    return fetchText(`${apiHost}/login`, {
        method: 'POST',
        headers: jsonHeader,
        body: JSON.stringify({ email, password })
    }).then(res => {
        if (res === CODE.DONE) {
            app.setItem('email', { email, expire: new Date(Date.now() + (20 * 86400 * 1000)) })
        }
        else {
            app.setItem('email', '')
        }
        return res
    }).catch(err => {
        console.error(err)
    })
}

export function logout() {
    return myFetch(`${apiHost}/logout`, {
        method: 'POST',
        headers: jsonHeader,
    }).then(res => {
        console.log(`api logout`, )
        app.setItem('email', '')
    })
}
