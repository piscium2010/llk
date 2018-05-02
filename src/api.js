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