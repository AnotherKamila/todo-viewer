ReactDOM   = require("react-dom")
TodoViewer = require("./TodoViewer.jsx")
require("./main.sass")

console.log('=====', 'loaded', new Date(), '=====')
var t = document.getElementById('todo-viewer') || document.body
ReactDOM.render(<TodoViewer />, t)
