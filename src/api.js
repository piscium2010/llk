export { CODE } from './server/constants'

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

const host = 'http://localhost:3000/llk'

export function getCourses() {
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res(['one','two','three','four'])
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

export function register(name, password) {
    return new Promise(( resolve, reject ) => {
        let xhttp = new XMLHttpRequest()
       

        let formData = new FormData()
        formData.append('name', name)
        formData.append('password', password)

        let data = JSON.stringify({
            name,
            password
        })

        console.log(`data`,data)

        xhttp.open('post', `${host}/register`)
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
