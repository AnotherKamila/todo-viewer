React    = require("react")
ReactDOM = require("react-dom")
clippath = 'url('+require("./tomato.svg")+'_clip)'

var cfg = {
    sessionMinutes: 25,
    updateInterval: 500
}

var Tomato = React.createClass({
    propTypes: {
        onComplete: React.PropTypes.func
    },

    getInitialState: function() {
        return { elapsed: 0 }
    },

    componentDidMount: function() {
        this.setState({ start: Date.now() })
        this.timer = setInterval(this.tick, cfg.updateInterval)
    },

    componentWillUnmount: function(){
        clearInterval(this.timer);
    },

    tick: function() {
        this.setState({ elapsed: Date.now() - this.state.start })
    },

    render: function() {
        // TODO get rid of the fixed size
        var maxt = cfg.sessionMinutes * 60 * 1000
          , dt = this.state.elapsed
        if (dt > maxt) {
            clearInterval(this.timer)
            this.timer = null
            this.props.onComplete()
            dt = maxt
        }
        var a = 2*Math.PI*dt/maxt
          , x = Math.sin(a) * 125
          , y = Math.cos(a) * - 125
          , mid = (a > Math.PI) ? 1 : 0
          , anim = 'M 0 0 v -125 A 125 125 1 ' 
               + mid + ' 1 ' 
               +  x  + ' ' 
               +  y  + ' z'
        return (
            // TODO clipPath is a resource -- figure out resources
            // (would also solve the 'id with multiple instances' problem)
            <div className='tomato'>
                <div className='tomato-timer-container'>
                    <svg width="250" height="250">
                        <rect x="-125" y="-125" width="250" height="250" transform="translate(125, 125)" clipPath={clippath} />
                        <path className="tomato-timer" d={anim} transform="translate(125, 125)" clipPath={clippath} />
                    </svg>
                </div>
            </div>
        )
    }    
})
module.exports = Tomato
