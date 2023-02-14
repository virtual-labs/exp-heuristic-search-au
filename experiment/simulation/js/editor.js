var nodes = graph.nodes;
var textArea = document.getElementById('editor');
var maxNodesNumber = 15;

window.onload = function() {
    let textarea = document.getElementById('editor');
    textarea.value = Math.floor(Math.random() * 10) + 4; // generate a random number between 1 and 15
    textarea.setAttribute("readonly", true); // make the textarea read-only
    updateGraph();
  };
  

  

function updateTextArea() {
    var size = nodes.length;
    var s = '' + size + '\n';
   
    textArea.value = s;
}

function resetTextArea(){
    textArea.value = '';
    
    // delete all nodes
    nodes.clear();
}


function updateGraph() {
    var lines = textArea.value.split('\n');
   console.log(lines)
    var size = Math.min(maxNodesNumber, parseInt(lines[0].split(' ')[0]));
    nodes.clear();
    console.log('hi')
    for (var i = 0; i < size; i++) {
        var x, y;
        x = Math.floor(Math.random() * 200);
        y = Math.floor(Math.random() * 200) - 100;
        if (i + 1 < lines.length) {
            var numbers = lines[i + 1].split(' ').map(function (x) {
                return parseInt(x);
            });
            if (numbers.length >= 2) {
                x = numbers[0];
                y = numbers[1];
            }
        }
        nodes.add({
            id: i,
            label: ''+String.fromCharCode(65+i),
            x: x,
            y: y
        })
    }
    // connect all nodes randomly
    var edges = [];
    for (var i = 0; i < size; i++) {
        for (var j = i + 1; j < size; j++) {
            edges.push({
                from: i,
                to: j,
                label: ''+Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
            });
        }
    }
    graph.edges.clear();
    graph.edges.add(edges);
    // zoom graph
    graphNetwork.fit();
    graphNetwork.focus(size - 1, {
        scale: 2,
        animation: false
    });
    

}

var timer = null;

$("#editor").keyup(function (e) {
    // check if backspace
    if (e.which == 8) {
        reset();
        updateGraph();
    }
    clearTimeout(timer);
    if (!parseInt(String.fromCharCode(e.which))) {
        updateGraph();
    } else {
        timer = setTimeout(function () {
            updateGraph();
        }, 1000);
    }
});

graphNetwork.on('dragEnd', function (params) {
    if (params.nodes.length > 0) {
        var node = nodes.get(params.nodes[0]);
        nodes.update({
            id: node.id,
            /*x: node.x + params.event.deltaX,
            y: node.y + params.event.deltaY,*/
            x: Math.trunc(params.pointer.canvas.x),
            y: Math.trunc(params.pointer.canvas.y)
        });
        updateTextArea();
        // update edges label
        var edges = graph.edges.get({
            filter: function (edge) {
                return edge.from == node.id || edge.to == node.id;
            }
        });
        edges.forEach(function (edge) {
            var from = nodes.get(edge.from);
            var to = nodes.get(edge.to);
            graph.edges.update({
                id: edge.id,
                label: ''+Math.round(
                    Math.sqrt(Math.pow(from.x - to.x, 2) + 
                    Math.pow(from.y - to.y, 2))
                ),
            });
        }
        );
    }
});




function smallGraph() {
    // textArea.value = '7\n' +
    // '169 113\n' +
    // '-156 77\n' +
    // '-67 -149\n' +
    // '45 21\n' +
    // '132 -111\n' +
    // '-88 -28\n' +
    // '0 -37\n' +
    // '-194 -91\n' +
    // '-64 -208\n' ;
   
        
    updateGraph();
}
