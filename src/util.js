export function setState(_this, state, duration = 1500) {
    _this.setState(state,()=>{
        setTimeout(()=>{
            
        }, duration)
    })
}