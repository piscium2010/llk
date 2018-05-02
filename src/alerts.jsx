import React from 'react'

export default class Message extends React.Component {
    static defaultProps = {
        type: 'alert-success',
        message: 'successful',
        onAnimationEnd: function() {}
    }

    render() {
        const { type, message, onAnimationEnd } = this.props

        return(
            message && <div className="mask" style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
                <div className={`alert ${type}`} role='alert' onAnimationEnd={onAnimationEnd}>
                    {message}
                </div>
            </div>
        )
    }
}