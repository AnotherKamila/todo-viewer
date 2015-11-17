(function() {
window.tomato = {}

tomato.session_min = 25
tomato.update_interval = 1000 // ms

function tomato_start(end_callback) {
    var path = '<path id="tomato-timer" transform="translate(125, 125)" style="fill: #f00" clip-path="url(#tomato-clip)"></path>'
      , clip = '<path id="tomato-clip" d="M -41.379904,96.154992 C -65.082016,87.106312 -82.957983,72.642096 -94.975393,52.788655 -102.72052,39.992852 -106.51058,26.23242 -106.6034,10.570473 c -0.0408,-6.8767723 3.53092,-23.767255 6.779812,-32.061788 11.472412,-29.289562 30.511932,-45.777208 55.412186,-47.985265 2.856427,-0.253311 6.866546,-0.389824 8.911394,-0.303406 6.610457,0.279453 6.76165,0.523763 -4.975614,-8.038551 -10.459771,-7.630414 -13.042896,-9.743696 -10.421401,-8.525883 0.668924,0.310732 4.703877,1.710811 8.966597,3.111179 4.262706,1.400427 15.935172,5.372477 25.938841,8.826724 10.0036435,3.454292 18.3710467,6.178364 18.5941923,6.053467 0.2231472,-0.124856 1.1447637,-2.356564 2.0480323,-4.959327 4.1954265,-12.089465 8.8860344,-20.345272 18.0091994,-31.697743 5.895786,-7.33648 12.358836,-13.6391 13.687478,-13.34771 1.003168,0.22001 10.344983,10.31143 10.021938,10.82607 -0.127442,0.20298 -3.51071,3.10196 -7.518363,6.44216 -16.140568,13.452558 -20.514966,19.258152 -22.980207,30.498877 l -1.140392,5.199827 1.442433,0.144536 c 0.793338,0.0795 5.175281,0.722349 9.737664,1.428546 4.562366,0.706183 11.107572,1.659359 14.544895,2.118109 3.437321,0.45876 10.814871,1.466406 16.394529,2.239172 5.579657,0.772816 10.952809,1.475855 11.940278,1.56233 1.006498,0.08817 1.547976,0.304172 1.232287,0.491687 -0.309701,0.183977 -5.581053,1.216538 -11.714046,2.294603 -15.098782,2.654134 -14.53077,2.461738 -10.933662,3.703434 23.66522,8.168995 40.77186,24.839316 45.867969,44.6980008 C 95.555399,2.3020006 96.278168,14.358383 95.138144,24.9091 94.361789,32.094087 91.135819,46.364787 89.158465,51.36138 82.50457,68.175182 67.626903,83.891298 49.661107,93.084703 37.856783,99.125289 19.998866,103.44952 4.8313717,103.93999 -8.9311861,104.38519 -28.423036,101.10147 -41.379904,96.154992 z M -5.7617567,98.92888 C 15.089464,100.07979 33.167824,96.119737 50.588498,86.585133 70.591584,75.637127 83.600436,58.759209 88.225845,37.753618 91.367882,23.485272 91.563314,6.7502748 88.722909,-4.7851167 84.46135,-22.092126 70.231139,-36.886093 50.178606,-44.8565 c -6.683948,-2.656776 -17.901314,-5.564066 -20.012528,-5.186827 -0.943427,0.16854 -1.729965,0.37332 -1.747889,0.455048 -0.01793,0.08176 0.705164,4.010311 1.606846,8.730183 2.989145,15.646606 4.327577,23.43231 4.05799,23.604926 -0.146553,0.09383 -5.110571,-6.194325 -11.031175,-13.973646 -5.920554,-7.77932 -10.937122,-14.18208 -11.147834,-14.228292 -0.210722,-0.04621 -0.654326,0.399238 -0.985796,0.989912 -1.9378399,3.453485 -12.3171857,20.01877 -12.716157,20.294882 -0.2628305,0.181909 -0.5187248,-0.597872 -0.5686021,-1.732866 -0.2131683,-4.849176 -1.6839301,-24.866405 -1.845637,-25.11898 -0.0974,-0.152045 -8.8812009,1.686073 -19.5196179,4.084806 -24.089291,5.431598 -27.082365,6.055858 -26.756461,5.580938 0.143691,-0.209389 6.872784,-4.129607 14.95356,-8.711628 17.414973,-9.874731 18.485517,-10.56276 17.679032,-11.361079 -1.057172,-1.046484 -7.002691,-2.666422 -11.80193,-3.215553 -20.969399,-2.399451 -42.095071,6.465925 -53.449074,22.429877 -2.984074,4.195638 -7.793911,13.079862 -10.942756,20.2123 -2.172538,4.921026 -2.772438,7.006355 -5.135118,17.8504321 -2.375929,10.9049307 -2.664689,12.8417762 -2.581069,17.3130929 0.26242,14.035398 4.135492,25.784776 13.075335,39.665724 2.653356,4.119798 6.671335,9.517649 8.928831,11.995273 4.864961,5.339129 14.7346,13.618738 20.413304,17.124528 5.812191,3.588097 15.187502,8.128296 21.521906,10.422219 6.88708,2.494064 24.801117,6.15913 32.0644773,6.56011 z" />'
      , rect = '<rect x="-125" y="-125" width="250" height="250" transform="translate(125, 125)" style="fill: #073642" clip-path="url(#tomato-clip)" />'
      , svg = '<svg width="250" height="250"><defs><clipPath id="tomato-clip">'+clip+'</clipPath></defs>'+rect+path+'</svg>'
    $(document.body).append('<div id="tomato-container"><div id="tomato-timer-container">'+svg+'</div></div>')

    tomato.timer_started = Date.now()
    var path = $('tomato-timer')
      , maxt = tomato.session_min * 60 * 1000 // to ms

    function die(){ $('#tomato-container').remove() }
    function draw() {
        dt = Date.now() - tomato.timer_started
        if (dt > maxt) {
            end_callback()
            setTimeout(die, 3000)
            return
        }

        var a = 2*Math.PI*dt/maxt
          , x = Math.sin(a) * 125
          , y = Math.cos(a) * - 125
          , mid = (a > Math.PI) ? 1 : 0
          , anim = 'M 0 0 v -125 A 125 125 1 ' 
               + mid + ' 1 ' 
               +  x  + ' ' 
               +  y  + ' z';

        document.getElementById('tomato-timer').setAttribute('d', anim)
        setTimeout(draw, tomato.update_interval); // Redraw
    }
    draw()
}
tomato.start = tomato_start

})()
