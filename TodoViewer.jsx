React       = require("react");
todoparser  = require("./todoparser")
todograph   = require("./todograph")
D3glue      = require("./D3glue")
Tomato      = require("./Tomato")
require("./TodoViewer.sass");

var path = 'example.yml' // TODO

var TodoViewer = React.createClass({
    getInitialState: function() {
        return {
            path: path,
            data: null,
            tomatoActive: false
        }
    },

    componentDidMount: function() {
        todoparser.get(this.state.path, function(data){
            if (this.isMounted) {
                this.setState({ data: data })
            }
        }.bind(this))
    },

    render: function() {
        var tomato, graph
        if (this.state.data) {
            graph = <D3glue graph={todograph}
                            data={this.state.data}
                            onClick={this.handleGraphClick} />
        }
        if (this.state.tomatoActive) {
            tomato = <Tomato onComplete={this.handleTomatoFinished} />
        }
        return (
            <div className="todo-viewer-wrapper">
                <header>
                    <span className="path">{this.state.path}</span>
                    <q>Do just a little bit more each day: 1.01<sup>365</sup> is 37.78, but 0.99<sup>365</sup> is just 0.026.</q>
                </header>
                {graph}
                {tomato}
            </div>
        )
    },

    handleGraphClick: function(e) {
        if (e.target.classList.contains('item')) {
            this.setState({ tomatoActive: true })
        }
    },

    handleTomatoFinished: function() {
        console.log('tomato done', new Date())
        setTimeout(function(){
            this.setState({ tomatoActive: false }
        )}.bind(this), 3000)
        // TODO beep or something
    }
})
module.exports = TodoViewer
