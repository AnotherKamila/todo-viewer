React    = require("react")
ReactDOM = require("react-dom")

var D3Component = React.createClass({
    propTypes: {
        graph: React.PropTypes.object,
        data:  React.PropTypes.object
    },

    getD3State: function() {
        return { data: this.props.data }
    },

    componentDidMount: function() {
        var el = ReactDOM.findDOMNode(this)
        this.props.graph.create(el, this.getD3State())
        // using native event handling because the children are not React components
        el.addEventListener('click', this.props.onClick)
    },
    
    componentDidUpdate: function() {
        var el = ReactDOM.findDOMNode(this)
        this.props.graph.update(el, this.getD3State())
    },

    componentWillUnmount: function() {
        var el = ReactDOM.findDOMNode(this)
        this.props.graph.destroy(el)
    },

    render: function() {
        var style = {
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        }
        return (
            <div className='d3component' style={style}></div>
        )
    },   
})
module.exports = D3Component
