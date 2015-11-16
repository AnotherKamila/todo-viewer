window.addEventListener('load', function() {
function $(id) { return document.getElementById(id) }
function xy(obj) { return { x: obj.x, y: obj.y } }
function oeach(obj, f) { Object.keys(obj).forEach(function(k){ f(k, obj[k])}) }
function omap(obj, f) { return Object.keys(obj).map(function(k){ return f(k, obj[k]) }) }
var markedOptions = { gfm: true, smartypants: true }
window.X = {} // exports for debugging

function read(rawyaml) {
    console.groupCollapsed('Parsing data...')
    function itemid(item) { return Object.keys(item)[0] }
    function itemdata(item) { return item[itemid(item)] }
    function notmeta(name) { return name != '_meta' }
    function notmetaid(item) { return notmeta(itemid(item)) }

    var yaml = jsyaml.safeLoad(rawyaml)
    var tracks = [], items = {}, links = [], itemsxy = []
    Object.keys(yaml).filter(notmeta).forEach(function(trackname, i1) {
        console.group('track "'+trackname+'": #'+i1)
        tracks.push({ x: i1, name: trackname })
        yaml[trackname].filter(notmetaid).forEach(function(item, i2) {
            var d = {
                x: i1,
                y: i2/yaml[trackname].length,
                track: trackname,
                name: itemid(item),
                id: trackname+'/'+itemid(item),
                data: itemdata(item)
            }
            console.log('item '+d.name+': y = '+d.y+',', d.data)
            items[d.id] = d
            if (d.data && d.data.depends) {
                d.data.depends.forEach(function(dep){
                    links.push({ source: d.id, target: dep })
                })
            }
        })
        console.groupEnd()
    })
    console.groupEnd()
    return { tracks: tracks, items: items, meta: yaml._meta || {}, links: links }
}

function draw(data, where) {
    function degrees(radians){ return radians / Math.PI * 180 - 90 }

    var size = { x: where.clientWidth, y: where.clientHeight },
        innerRadius = 18,
        border = 18,
        trackLabelSpace = 40,
        outerRadius = Math.min(size.x, size.y)/2 - border,
        itemradius = 6
    var angle = d3.scale.ordinal().domain(d3.range(data.tracks.length+1)).rangePoints([0, 2 * Math.PI]),
        radius = d3.scale.linear().range([outerRadius, innerRadius+trackLabelSpace])

    var svg = d3.select(where).append("svg")
        .attr("width", size.x)
        .attr("height", size.y)
        .append("g")
            .attr("transform", "translate(" + size.x / 2 + "," + size.y / 2 + ")")

    var done_y = data.tracks.map(function(t){ return { x: t.x, y: -0.1 } })
    oeach(data.items, function(_, itm) {
        if (itm.data && itm.data.done) done_y[itm.x].y = Math.max(done_y[itm.x].y, itm.y)
    })
    done_arcs = done_y.map(function(_, i) { return { source: done_y[i], target: done_y[(i+1)%done_y.length] } })
    X.done_arcs = done_arcs
    svg.selectAll(".done-arc")
        .data(done_arcs)
        .enter().append("path")
            .attr("class", "done-arc")
            .attr("d", d3.hive.link()
                .angle(function(d) { return angle(d.x) })
                .startRadius(function(d) { return radius(d.y+.02) })
                .endRadius(radius(1.3)))
                //.endRadius(function(d){ return radius(d.y) }))

    svg.selectAll(".track")
        .data(data.tracks)
        .enter().append("line")
            .attr("class", "track")
            .attr("name", function(d){ return d.name })
            .attr("id", function(d){ return d.id })
            .attr("transform", function(d){ return "rotate(" + degrees(angle(d.x)) + ")" })
            .attr("x1", radius.range()[0])
            .attr("x2", radius.range()[1]-trackLabelSpace)

    svg.selectAll(".track-labels")
        .data(data.tracks)
        .enter().append("text")
            .attr("dx", 19)
            .attr("dy", "0.35em")
            .attr("text-anchor", "right")
            .attr("transform", function(d){ return "rotate("+degrees(angle(d.x))+")" })
            .text(function(d) { return d.name.toUpperCase() })

    svg.selectAll(".link")
        .data(data.links)
        .enter().append("path")
            .attr("class", "link")
            .style("marker-end", "url(#marker-arrow)")
            .attr("d", d3.hive.link()
                .angle(function(d) { return angle(data.items[d].x); })
                .radius(function(d) { return radius(data.items[d].y); }))

    var itemdata = omap(data.items, function(_, v) { return { x: v.x, y: v.y, id: v.id, name: v.name, done: v.data && v.data.done } })
    svg.selectAll(".item")
        .data(itemdata)
        .enter().append("circle")
            .attr("class", function(d){ return "item"+(d.done ? " done" : "") })
            .attr("name", function(d) { return d.name })
            .attr("id", function(d) { return d.id })
            .attr("transform", function(d) { return "rotate(" + degrees(angle(d.x)) + ")"; })
            .attr("cx", function(d) { return radius(d.y); })
            .attr("r", itemradius)

    svg.selectAll(".item-labels")
        .data(itemdata)
        .enter().append("text")
            .attr("dx", itemradius+3)
            .attr("dy", itemradius/2)
            .attr("transform", function(d) {
                return "rotate("+degrees(angle(d.x))+") "+
                       "translate("+radius(d.y)+") "+
                       "rotate("+(-1)*degrees(angle(d.x)+.2)+")"
                       
            })
            .text(function(d) { return d.name.toUpperCase() })

    if (data.meta.favicon) {
        svg.append("image")
            .attr("width", 2*innerRadius)
            .attr("height", 2*innerRadius)
            .attr("x", -innerRadius)
            .attr("y", -innerRadius)
            .attr("xlink:href", data.meta.favicon)
    }
}

function parseWhat(item) {
    t = ['<span class="info-name">'+item.name+'</span>']
    if (typeof item.data == 'string') t.push(marked(item.data, markedOptions))
    else if (item.data) {
        t.push(marked(item.data.what, markedOptions))
        oeach(item.data, function(k, v) {
            if (k != 'what' && k != 'depends') t.push(k+': '+v)
        })
    }
    return t.join('<br>')
}

function setupActiveInfo(where, items, infobox) {
    var _active_now
    where.addEventListener('mouseover', function(e) {
        var handlers = {
            track: function(e, t) { return t.__data__.name },
            item: function(e, t) { return parseWhat(items[t.id]) }
        }
        if (_active_now) _active_now.classList.remove('active')
        _active_now = e.target
        e.target.classList.add('active')
        var text
        Object.keys(handlers).forEach(function(classname) {
            if (e.target.classList.contains(classname)) text = handlers[classname](e, e.target)
        })
        infobox.innerHTML = text ? text : ''
    })
}

var xhr = new XMLHttpRequest();
xhr.open('GET', 'example.yml', true);
xhr.onload = function(e) {
    var rawyaml = this.status == 200 ? this.responseText : "_meta: { what: Couldn't load YAML :-( }"
    var data = read(rawyaml)
    draw(data, $('content'))
    setupActiveInfo($('content'), data.items, $('active-info'))
}
xhr.send()

})
