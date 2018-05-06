export { CODE } from './server/constants'

export const app = {
    setItem: function(key, value) {
        console.log(`set item`,key, value)
        localStorage.setItem(key, value)
        console.log(`api app email`,localStorage.getItem('email'))
    },
    isLogin: function(){
        return localStorage.getItem('email') ? true : false
    },
    email: function() {
        return localStorage.getItem('email')
    }
}

const jsonHeader = { "Content-Type": "application/json" }

const data = [
    {
        name: 'abolition',
        value: 'n. feichu'
    },
    {
        name: 'trunk',
        value: 'n. xinglixiang'
    },
    {
        name: 'abolition',
        value: 'n. feichu'
    },
    {
        name: 'abolition',
        value: 'n. feichu'
    },
    {
        name: 'trunk',
        value: 'n. xinglixiang'
    },
    {
        name: 'abolition',
        value: 'n. feichu'
    }
    
]

const apiHost = 'http://localhost:3000/llk'

function fetchJson(url, options) {
    return fetch(url, Object.assign({}, options, { credentials: 'include' })).then(res => {
        res.text().then(result => {
            try {
                return JSON.parse(result)
            } catch (err) {
                console.error('api ', err);
                return Promise.reject()
            }
        }).catch(err => {
            throw err
        })
    })
}

export function getCourses() {
    if(app.email()) {
        console.log(`getcourse email`,app.email())
        return fetchJson(`${apiHost}/courses`,{
            method:'GET',
            headers: jsonHeader
        })
    }

    return new Promise((res,rej)=>{
        setTimeout(()=>{
            console.log(`example`,)
            res(['example'])
        },1000)
    })
}

export function getCourse(name) {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res('gorgeous\nadj.极好的\nawesome\nadj.棒极了')
        },1000)
    })
}

export function addCourse() {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res(['one','two','three','four','New'])
        },1000)
    })
}

export function saveCourse() {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res()
        },1000)
    })
}

export function register(email, password) {
    return new Promise(( resolve, reject ) => {
        let xhttp = new XMLHttpRequest()
       

        // let formData = new FormData()
        // formData.append('name', name)
        // formData.append('password', password)

        let data = JSON.stringify({
            email,
            password
        })

        //console.log(`data`,data)

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

export function findUser(email) {
    return fetch(`${apiHost}/findUser?email=${email}`, { method: 'GET' })
}

export function login(email, password) {
    return fetch(`${apiHost}/login`, { 
        method: 'POST',
        headers: jsonHeader,
        body: JSON.stringify({email, password})
    }).then(res => {
        try {
            console.log(`api login res`,)
            return res.text()
        }catch(err) {
            console.error(err);
            return res
        }
    })
}

export function isLogin() {
    return false
}
