//_ = require("lodash")
jsyaml = require("js-yaml")

function parse(raw) {
    function itemid(item) { return Object.keys(item)[0] }
    function itemdata(item) { return item[itemid(item)] }
    function notmeta(name) { return name != '_meta' }
    function notmetaid(item) { return notmeta(itemid(item)) }
    console.groupCollapsed('Parsing data...')

    var yaml = jsyaml.safeLoad(raw)
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

// TODO error handling? :D
exports.get = function(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function(e) {
        var raw = this.status == 200 ? this.responseText : "_meta: { what: Couldn't load YAML =( }"
        callback(parse(raw))
    }
    xhr.send()
}
