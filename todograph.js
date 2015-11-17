d3     = require("d3")
d3hive = require("./d3hive")

exports.create = function create(el, state) { render(el, state.data) }
exports.destroy = function destroy(el) {}
exports.update = function update(el, state) {}

var cfg = {
    innerRadius:     18,
    border:          22,
    trackLabelSpace: 40,
    taskradius:      6,
    markedOptions:   { gfm: true, smartypants: true }
}

function render(el, data) {
    console.log('Will render data:', data)

    var w = el.clientWidth, h = el.clientHeight
    var svg = d3.select(el).append("svg")
        .attr("width", w)
        .attr("height", h)

    var g = svg.append("g")
        .attr("transform", "translate("+w/2+","+(cfg.border/2+h/2)+")")

    function oeach(obj, f) { Object.keys(obj).forEach(function(k){ f(k, obj[k])}) }
    function omap(obj, f) { return Object.keys(obj).map(function(k){ return f(k, obj[k]) }) }

    function degrees(radians){ return radians / Math.PI * 180 - 90 }
    var outerRadius = Math.min(w, h)/2 - cfg.border
    var angle = d3.scale.ordinal().domain(d3.range(data.tracks.length+1)).rangePoints([0, 2 * Math.PI]),
        radius = d3.scale.linear().range([outerRadius, cfg.innerRadius+cfg.trackLabelSpace])
    var done_y = data.tracks.map(function(t){ return { x: t.x, y: -0.1 } })
    oeach(data.tasks, function(_, itm) {
        if (itm.data && itm.data.done) done_y[itm.x].y = Math.max(done_y[itm.x].y, itm.y)
    })
    var taskdata = omap(data.tasks, function(_, v) { return { x: v.x, y: v.y, id: v.id, name: v.name, done: v.data && v.data.done } })

    done_arcs = done_y.map(function(_, i) { return { source: done_y[i], target: done_y[(i+1)%done_y.length] } })
    g.selectAll(".done-arc")
        .data(done_arcs)
        .enter().append("path")
            .attr("class", "done-arc")
            .attr("d", d3hive.link()
                .angle(function(d) { return angle(d.x) })
                .startRadius(function(d) { return radius(d.y+.02) })
                .endRadius(radius(1.3)))
                //.endRadius(function(d){ return radius(d.y) }))

    g.selectAll(".track")
        .data(data.tracks)
        .enter().append("line")
            .attr("class", "track")
            .attr("name", function(d){ return d.name })
            .attr("id", function(d){ return d.id })
            .attr("transform", function(d){ return "rotate(" + degrees(angle(d.x)) + ")" })
            .attr("x1", radius.range()[0])
            .attr("x2", radius.range()[1]-cfg.trackLabelSpace)

    g.selectAll(".track-labels")
        .data(data.tracks)
        .enter().append("text")
            .attr("dx", 19)
            .attr("dy", "0.35em")
            .attr("text-anchor", "right")
            .attr("transform", function(d){ return "rotate("+degrees(angle(d.x))+")" })
            .text(function(d) { return d.name.toUpperCase() })

    g.selectAll(".link")
        .data(data.links)
        .enter().append("path")
            .attr("class", "link")
            .style("marker-end", "url(#marker-arrow)")
            .attr("d", d3hive.link()
                .angle(function(d) { return angle(data.tasks[d].x); })
                .radius(function(d) { return radius(data.tasks[d].y); }))

    g.selectAll(".task")
        .data(taskdata)
        .enter().append("circle")
            .attr("class", function(d){ return "task"+(d.done ? " done" : "") })
            .attr("name", function(d) { return d.name })
            .attr("id", function(d) { return d.id })
            .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
            .attr("cx", function(d) { return radius(d.y); })
            .attr("r", cfg.taskradius)

    g.selectAll(".task-labels")
        .data(taskdata)
        .enter().append("text")
            .attr("dx", cfg.taskradius+3)
            .attr("dy", cfg.taskradius/2)
            .attr("transform", function(d) {
                return "rotate("+degrees(angle(d.x))+") "+
                       "translate("+radius(d.y)+") "+
                       "rotate("+(-1)*degrees(angle(d.x)+.2)+")"
                       
            })
            .text(function(d) { return d.name.toUpperCase() })

    if (data.meta.favicon) {
        g.append("image")
            .attr("width", 1.6*cfg.innerRadius)
            .attr("height", 1.6*cfg.innerRadius)
            .attr("x", -.8*cfg.innerRadius)
            .attr("y", -.8*cfg.innerRadius)
            .attr("xlink:href", data.meta.favicon)
    }
}
