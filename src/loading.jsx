import React from 'react'

export default class Loading extends React.Component {
    static defaultProps = {
        show: false
    }
    render() {
        return (
            this.props.show && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <div className="loading"></div>
            </div>
        )
    }
}