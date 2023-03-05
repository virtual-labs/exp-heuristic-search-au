var nodes = graph.nodes;
var textArea = document.getElementById('editor');
document.getElementById("editor").disabled = true;

var maxNodesNumber = 100;

textArea.addEventListener("input", function (event) {
    let value = event.target.value;
    let popup = document.getElementById("popup");
    if (isNaN(value) || value < 1 || value >= 100) {
        event.target.value = "";
        event.preventDefault();

        if (!popup) {
            popup = document.createElement("div");
            popup.id = "popup";
            popup.innerHTML = `
          <div class="overlay">
            <div class="popup">
              <h2>Enter a numeric value between 1 and 100</h2>
              <a class="close" href="#popup">&times;</a>
            </div>
          </div>
        `;
            document.body.appendChild(popup);

            let closePopupAnchor = popup.querySelector(".close");
            closePopupAnchor.addEventListener("click", function (event) {
                event.preventDefault();
                popup.style.display = "none";
                textArea.value = "";
            });
        } else {
            popup.style.display = "block";
        }
        textArea.focus();
    } else {
        if (popup) {
            popup.style.display = "none";
        }
    }
});




graph.edges





function updateTextArea() {
    var size = nodes.length;
    var s = '' + size + '\n';
    // nodes.forEach(function (node) {
    //    `${s += node.x + ' ' + node.y + '\n'}` 
    //   `${ s += node.x + ' ' + node.y + '\n'}`
    //  }
    // );
    textArea.value = s;
}

function resetTextArea() {
    textArea.value = '';
    // delete all nodes
    nodes.clear();
}


function updateGraph() {
    var lines = textArea.value.split('\n');


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
            label: '' + String.fromCharCode(65 + i),
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
        animation: false,



    });



}

// graphNetwork.on('doubleClick', function (params) {
//     console.log(params.nodes.length);
//     console.log(params.edges.length);

//     var edge = graph.edges.get(params.edges[0]);
//     var from = nodes.get(edge.from);
//     var to = nodes.get(edge.to);
//     var distance = null;    //= Math.round(Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)));
//     var newDistance = prompt("Enter new distance", distance);
//     if (newDistance != null) {
//         graph.edges.clear();
//                 var size = nodes.length;
//                 for (var i = 0; i < size; i++) {
//                     for (var j = i + 1; j < size; j++) {
//                         graph.edges.add({
//                             from: i,
//                             to: j,
//                             label: '' + Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
//                         });
//                     }
//                 }

//     }


// });
//onclick to egde to change label
graphNetwork.on('click', function (params) {
    params.event = "[original event]";
    console.log(params.edges.length);
    if (params.edges.length == 1) {
        const clickedEdge = params.edges[0]
         const newDistance = prompt("Enter New distance")
        graph.edges.update({
            id: clickedEdge,
            label: newDistance
        });
    }
    // if (params.edges.length == 1) {
    //     var edge = graph.edges.get(params.edges[0]);
    //     var from = nodes.get(edge.from);
    //     var to = nodes.get(edge.to);
    //     var distance = Math.round(Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)));
    //     var newDistance = prompt("Enter new distance", distance);
    //     if (newDistance != null) {
    //         if (1) {
    //             var t = newDistance / distance;
    //             var x = ((1 - t) * from.x + t * to.x);
    //             var y = ((1 - t) * from.y + t * to.y);
    //             nodes.update({
    //                 id: to.id,
    //                 x: x,
    //                 y: y
    //             });
    //             // clear all edges and add new edges
    //             graph.edges.clear();
    //             var size = nodes.length;
    //             for (var i = 0; i < size; i++) {
    //                 for (var j = i + 1; j < size; j++) {
    //                     graph.edges.add({
    //                         from: i,
    //                         to: j,
    //                         label: '' + Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
    //                     });
    //                 }
    //             }
    //         } else if (distance < newDistance) {
    //             var update = newDistance - distance;
    //             var x = from.x - update;
    //             var y = from.y - update;
    //             nodes.update({
    //                 id: from.id,
    //                 x: x,
    //                 y: y
    //             });
    //             // clear all edges and add new edges
    //             graph.edges.clear();
    //             for (var i = 0; i < size; i++) {
    //                 for (var j = i + 1; j < size; j++) {
    //                     graph.edges.add({
    //                         from: i,
    //                         to: j,
    //                         label: '' + Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
    //                     });
    //                 }
    //             }



    //         }
    //     }
    // }
});
//change node position according to newDistance


var timer = null;

$("#editor").keyup(function (e) {
    // check if backspace
    if (e.which == 8) {
        reset();
        updateGraph();
    }
    clearTimeout(timer);
    console.log(parseInt(textArea.value))
    if (!parseInt(String.fromCharCode(e.which))) {
        if (parseInt(textArea.value) >= 15 || parseInt(textArea.value) < 1) {
            ;
        } else {
            updateGraph();
        }
    } else {
        if (parseInt(textArea.value) >= 15 || parseInt(textArea.value) < 1) {

            ;
        } else {
            timer = setTimeout(function () {
                updateGraph();
            }, 1000);
        }
    }
});

// graphNetwork.on('dragEnd', function (params) {
//     if (params.nodes.length > 0) {
//         var node = nodes.get(params.nodes[0]);
//         nodes.update({
//             id: node.id,

//             /*x: node.x + params.event.deltaX,
//             y: node.y + params.event.deltaY,*/
//             x: Math.trunc(params.pointer.canvas.x),
//             y: Math.trunc(params.pointer.canvas.y)
//         });
//         updateTextArea();
//         // update edges label
//         var edges = graph.edges.get({
//             filter: function (edge) {
//                 return edge.from == node.id || edge.to == node.id;
//             }
//         });








//         edges.forEach(function (edge) {
//             var from = nodes.get(edge.from);
//             var to = nodes.get(edge.to);
//             graph.edges.update({
//                 id: edge.id,
//                 label: '' + Math.round(
//                     Math.sqrt(Math.pow(from.x - to.x, 2) +
//                         Math.pow(from.y - to.y, 2))
//                 ),
//             });
//         }
//         );


//     }





//     // delete tree
//     tree = {
//         nodes: new vis.DataSet(),
//         edges: new vis.DataSet()
//     };
//     treeNetwork = new vis.Network(
//         treeContainer,
//         { nodes: tree.nodes, edges: tree.edges },
//         treeOptions
//     );




// });

graphNetwork.on('doubleClick', function doubleClick(params) {
    if (params.nodes.length === 0 && params.edges.length === 0 && nodes.length < maxNodesNumber) {
        nodes.add({
            id: nodes.length,
            label: '' + String.fromCharCode(65 + nodes.length),
            x: Math.trunc(params.pointer.canvas.x),
            y: Math.trunc(params.pointer.canvas.y)
        });

    }
    var edges = [];
    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
            edges.push({
                from: i,
                to: j,
                label: '' + Math.round(Math.sqrt(Math.pow(nodes.get(i).x - nodes.get(j).x, 2) + Math.pow(nodes.get(i).y - nodes.get(j).y, 2))),
            });
        }
    }
    graph.edges.clear();
    graph.edges.add(edges);

    updateTextArea();



},);



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

