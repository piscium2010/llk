import React from 'react'
import { withRouter } from 'react-router'

export const InlineCommand = ({children, ...restProps}) => <button className="inline-command" {...restProps}>
    {children}
</button>

export const CommandBar = props => <div className="commandbar">{props.children}</div>

export const Command = ({children, ...restProps}) => <button className="command" {...restProps}>
    {children}
</button>

class _Link extends React.Component {
    render() {
        const { to, match, location, history, children, ...restProps } = this.props
        const onClick = function(evt) {

            evt.stopPropagation()

            if(to === 'back') {
                history.goBack()
            }
            else {
                history.push(to)
            }
        }
        return(
            React.cloneElement(children, Object.assign({},restProps,{onClick}))
        )
    }
}

export const Link = withRouter(_Link)