import React from 'react'
import { getCourse } from './api'
import Loading from './loading'
import { shuffle } from 'lodash'
import classnames from 'classnames'
import './game.less'
import { Command, Link } from './common'
import Icon from './icons'

export default class GameLoader extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: null
        }
    }
    componentDidMount() {
        getCourse(this.props.match.params.courseId)
            .then(result=>{
                return result
            })
            .then(({words}) => 
                this.processWords(words)
            )
            .then(data => {
                this.setState({
                    data,
                    loading: false
                })
            })
    }

    processWords(words) {
        let arr = words.split('\n')
        let temp = []
        let data = []
        for(let i = 0; i < arr.length; i += 2) {
            temp.push({
                name: arr[i],
                value: arr[i + 1]
            })
        }

        temp.forEach((d,i) => {
            data.push(
                {
                    text: d.name,
                    linkId: i
                }
            )
            data.push(
                {
                    text: d.value,
                    linkId: i
                }
            )
        })

        return data
    }

    render() {
        return(
            <div className="game">
                    <Loading show={this.state.loading}/>
                    {
                        this.state.data && <Game data={this.state.data} />
                    }
            </div>
        )
    }
}

class Game extends React.Component {
    static defaultProps = {
        pageCount: 20,
        data: []
    }

    constructor(props) {   
        super(props)
        this.pages = this.getPages()
        this.pageData = this.pages.next().value
        this.state = {
            cardstates: this.initCardStates(this.pageData),
            stack: [],
            complete: false
        }
        this.onClick = this.onClick.bind(this)
        this.goToNextPageIfAllMatched = this.goToNextPageIfAllMatched.bind(this)
        this.restart = this.restart.bind(this)
    }

    render() {
        const state = this.state
        
        return (
            state.complete ? 
                    <GameOver restart={this.restart}/>
                    :
            <div className='main'>
                {
                    this.pageData.map((d,i) => {

                        let cardstate = state.cardstates[i]
                        
                        return <Card 
                                    index={i}
                                    key={`${d.text}-${i}`} 
                                    text={d.text} 
                                    linkId={d.linkId}
                                    onClick={this.onClick} 
                                    selected={cardstate.selected}
                                    shake={cardstate.shake}
                                    matched={cardstate.matched}
                                />
                    })
                }
            </div>
        )
    }

    *getPages() {
        let data = this.props.data
        let len = data.length
        let i = 0
        let count = this.props.pageCount

        while(i < len) {
            let arr = data.slice(i, Math.min(i + count, len))
            arr = shuffle(arr)
            yield arr
            i = i + count
        }
    }

    goToNextPageIfAllMatched() {
        let allMatched = this.state.cardstates.filter( s => s.matched === false).length === 0

        if(allMatched) {
            this.pageData = this.pages.next().value
            if(this.pageData) {
                this.setState({
                    cardstates: this.initCardStates(this.pageData)
                })
            }
            else {
                this.setState({
                    complete: true
                })
            }
        }
    }

    initCardStates(data = []) {
        return data.map(d => ({ selected: false, shake: false, matched: false }))
    }
  
    onClick(props) {
        let { matched, index, selected, shake, linkId} = props
        let cardstates = this.state.cardstates.map(i => i)
        let stack = this.state.stack
        let cardstate = cardstates[index]

        let _toggle = (index) => {
            cardstates[index].selected = !cardstates[index].selected
        }

        let _match = (index) => {
            cardstates[index].matched = true
        }

        let _shake = (index) => {
            cardstates[index].shake = true
        }

        if(matched) return;

        //select first card
        if(stack.length === 0) {
            stack.push(props)
            _toggle(index)
        }
        //select second card
        else if(stack.length === 1) {
            let selectedCard = stack[0]

            //de select
            if(index === selectedCard.index) {
                stack.pop()
                _toggle(index)
            }
            //wrong answer
            else if(linkId !== selectedCard.linkId) {
                //shake
                _shake(index)
            }
            //right answer
            else {
                stack.pop()
                _toggle(index)
                _match(index)
                _match(selectedCard.index)
            }
        }

        this.setState({
            cardstates
        }, () => {
            //remove shake class
            if (cardstate.shake) {
                setTimeout(() => {
                    cardstates[index].shake = false
                    this.setState({ cardstates })
                }, 1000)
            }
            else {
                setTimeout(this.goToNextPageIfAllMatched,2000)
            }
        })
    }

    restart() {
        this.pages = this.getPages()
        this.pageData = this.pages.next().value
        this.setState({
            cardstates: this.initCardStates(this.pageData),
            stack: [],
            complete: false
        })
    }
}

class Card extends React.Component {
    static defaultProps = {
        onClick: function() {},
        selected: false,
        text: '',
        matched: false
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    render() {
        const { text, onClick, selected, shake, linkId, matched } = this.props
        const state = this.state

        const className = classnames({
            'card': true,
            'selected': selected,
            'shake': shake,
            'bounceOut': matched
        })

        return <span className={className} onClick={this.onClick}>{text}</span>
    }

    onClick(e) {
        this.props.onClick(this.props)
    }

}

class GameOver extends React.Component {
    render() {
        return(
            <div ref={ref=>this.nodeRef = ref} className="gameover bounceInUp">
                <div>
                    <Command style={{display:'inline-flex'}} onClick={this.props.restart}>
                        <Icon name='refresh' width={28} height={28}/>
                    </Command>
                    <Link to='back'>
                        <Command style={{display:'inline-flex'}}>
                            <Icon name='back' width={28} height={28}/>
                        </Command>
                    </Link>
                </div>
            </div>
        )
    }
}