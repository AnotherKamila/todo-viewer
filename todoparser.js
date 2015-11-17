//_ = require("lodash")
jsyaml = require("js-yaml")

function parse(raw) {
    function taskid(task) { return Object.keys(task)[0] }
    function taskdata(task) { return task[taskid(task)] }
    function notmeta(name) { return name != '_meta' }
    function notmetaid(task) { return notmeta(taskid(task)) }
    console.groupCollapsed('Parsing data...')

    var yaml = jsyaml.safeLoad(raw)
    var tracks = [], tasks = {}, links = []
    Object.keys(yaml).filter(notmeta).forEach(function(trackname, i1) {
        console.group('track "'+trackname+'": #'+i1)
        tracks.push({ x: i1, name: trackname })
        yaml[trackname].filter(notmetaid).forEach(function(task, i2) {
            var d = {
                x: i1,
                y: i2/yaml[trackname].length,
                track: trackname,
                name: taskid(task),
                id: trackname+'/'+taskid(task),
                data: taskdata(task)
            }
            console.log('task '+d.name+': y = '+d.y+',', d.data)
            tasks[d.id] = d
            if (d.data && d.data.depends) {
                d.data.depends.forEach(function(dep){
                    links.push({ source: d.id, target: dep })
                })
            }
        })
        console.groupEnd()
    })
    console.groupEnd()
    return { tracks: tracks, tasks: tasks, meta: yaml._meta || {}, links: links }
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
