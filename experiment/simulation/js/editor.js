






var nodes = graph.nodes;
var textArea = document.getElementById('editor');
var maxNodesNumber = 10;
const cityNames = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];

window.onload = function() {
    let textarea = document.getElementById('editor');
    updateGraph();
  };
  

$('#editor').on('input', function() {
    if ($(this).val() > 10) {
        $(this).val(10);
    }
});

$('#editor').on('blur', function() {
    if ($(this).val() < 3) {
        $(this).val(3);
    }
});
  

function updateTextArea() {
    var size = nodes.length;
    var s = '' + size + '\n';
   
    textArea.value = s;
}

// function resetTextArea(){
//     textArea.value = '';
    
//     // delete all nodes
//     nodes.clear();
// }


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
            label: String.fromCharCode(65+i) + '\n' + cityNames[i],
            x: x,
            y: y
        })
    }
    // connect all nodes randomly
    var edges = [];
    for ( i = 0; i < size; i++) {
        for (var j = i + 1; j < size; j++) {
            edges.push({
                from: i,
                to: j,
                label: '' + Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
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
    
    const startNodeInput = document.getElementById("startNodeInput");
    startNodeInput.innerHTML = "";
    for (let i = 0; i < size; i++) {
        const option = document.createElement("option");
        option.value = cityNames[i];
        option.text = cityNames[i];
        startNodeInput.appendChild(option);
    }
}

var timer = null;

$("#editor").keyup(function (e) {
    // check if backspace
    if (e.which == 8) {
        // reset();
        updateGraph();
    }
    clearTimeout(timer);
    if (!parseInt(String.fromCharCode(e.which))) {
        updateGraph();
    }
    else {
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
        //updateTextArea();
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
                label: '' + Math.round(
                    Math.sqrt(Math.pow(from.x - to.x, 2) + 
                    Math.pow(from.y - to.y, 2))
                ),
            });
        }
        );
    }
});




function smallGraph() {
    
   
        
    updateGraph();
}
