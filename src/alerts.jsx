import React from 'react'
import classnames from 'classnames'

export default class Message extends React.Component {
    static defaultProps = {
        type: 'alert-success',
        message: 'successful',
        onAnimationEnd: function() {}
    }

    render() {
        const { type, message, onAnimationEnd, onClose } = this.props
        let className = classnames({
            fadeOut: onClose ? false : true,
            'alert-dismissible': onClose ? true : false
        })

        return(
            message && <div className="mask" style={{display:'flex',justifyContent:'center',alignItems:'center'}} >
                <div className={`${className} alert ${type}`} role='alert' onAnimationEnd={onAnimationEnd}>
                    {message}
                    {
                        onClose && 
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    }
                    
                </div>
            </div>
        )
    }
}