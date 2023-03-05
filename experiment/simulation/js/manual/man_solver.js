let orignalEdges;

var info = document.getElementById('info');
var dist;
var path = '';

function approximate(path, n, d) {
    if (path.length === n) {
        return 0;
    }
    var from = [];
    var to = [];
    var approximation = 0;
    for (var i = 0; i < n; i++) if (path.indexOf(i) === -1) from.push(i);
    for (var j = 0; j < n; j++) if (path.indexOf(j) === -1) to.push(j);
    if (path.length > 0) from.push(path[path.length - 1]);
    if (path.length > 0) to.push(path[0]);
    var nearest = new Array(n);
    for (var a = 0; a < from.length; a++) {
        var minimal = Infinity;
        for (var b = 0; b < to.length; b++) {
            if (from[a] !== to[b]) {
                minimal = Math.min(minimal, d[from[a]][to[b]]);
            }
        }
        nearest[from[a]] = minimal;
        approximation += minimal;
    }
    for (var c = 0; c < to.length; c++) {
        var delta = Infinity;
        for (var e = 0; e < from.length; e++) {
            if (from[e] !== to[c]) {
                delta = Math.min(delta, d[from[e]][to[c]] - nearest[from[e]]);
            }
        }
        approximation += delta;
    }
    return approximation;
}

function nextState(state, next, n, d) {
    var nextState = {
        path: state.path.slice(),
        length: state.length
    };
    if (state.path.length > 0) {
        nextState.length += d[state.path[state.path.length - 1]][next];
    }
    nextState.path.push(next);
    if (nextState.path.length === n) {
        nextState.length += d[next][state.path[0]];
    }
    nextState.approximation = nextState.length + approximate(nextState.path, n, d);
    return nextState;
}

function solvePlanar(solver) {  
    // Deep copy graph.edges
    orignalEdges = new Array(graph.edges.length);
    graph.edges.forEach(element => {
        orignalEdges.push(element);
    })

    path='';
    var nodes = graph.nodes;
    var n = nodes.length;
    var d = new Array(n);

    const startNodeInput = document.getElementById("startNodeInput");
    let popup1 = document.getElementById("popup1");
    let popup2 = document.getElementById("popup2");
    if (!startNodeInput.value) {
        if (!popup2) {
            popup2 = document.createElement("div");
            popup2.id = "popup2";

            popup2.innerHTML = `
          <div class="overlay2">
            <div class="popup2">
              <h2>Please select a start node</h2>
              <a class="close2" href="#popup2">&times;</a>
            </div>
          </div>
        `;
            document.body.appendChild(popup2);

            let closePopupAnchor = popup2.querySelector(".close2");
            closePopupAnchor.addEventListener("click", function (event) {
                event.preventDefault();
                startNodeInput.value = "";
                popup2.style.display = "none";
            });
        } else {
            popup2.style.display = "block";
        }
        startNodeInput.focus();
        return;
    }
     startNodeInput.value = startNodeInput.value.toUpperCase();
     startNodeInput.value = startNodeInput.value.charCodeAt(0) - 65;
     console.log(startNodeInput.value)
    if (startNodeInput.value < 0 || startNodeInput.value >= n) {
        if (!popup1) {
            popup1 = document.createElement("div");
            popup1.id = "popup1";

            popup1.innerHTML = `
            <div class="overlay1">

            <div class="popup1">
                <h2>Please select a valid start node</h2>
                <a class="close1" href="#popup1">&times;</a>
            </div>
            </div>
        `;
            document.body.appendChild(popup1);

            let closePopupAnchor = popup1.querySelector(".close1");
            closePopupAnchor.addEventListener("click", function (event) {
                event.preventDefault();
                startNodeInput.value = "";
                popup1.style.display = "none";
            });
        } else {
            popup1.style.display = "block";
        }
        startNodeInput.focus();
        return;
    }
    for ( let i = 0; i < n; i++) {
        d[i] = new Array(n);
        // Set all intitial to zero
        for (let j = 0; j < n; j++) {
            d[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        graph.edges.forEach( (element) => {
            if (i == element.from) {
                d[i][element.to] = parseInt(element.label)
            }
        })
    }
  
    for (let i = 0; i < n; i++) {
        for( let j = 0; j < n; j++) {
            if(d[i][j] != 0) {
                d[j][i] = d[i][j]
            }
        }
    }


    console.log(d)
    solver(n, d);
}

function reset() {
    console.log("reset");
    tree.nodes.clear();
    tree.edges.clear();
    graph.edges.clear();
    graph.node.clear();
    info.innerHTML = '';
    nodes.clear();
    clearText();
    document.getElementById("shortest_path").innerHTML = "";
    updateTextArea();
    document.getElementById('path Explanation').innerHTML = '';
}

function resetOnlyResult() {
    console.log("reset");
    tree.nodes.clear();
    tree.edges.clear();

    info.innerHTML = '';
    clearText();
    document.getElementById("shortest_path").innerHTML = "";
    updateTextArea();
    document.getElementById('path Explanation').innerHTML = '';
}

const nodesData = tree.nodes._data;
let distances = "";
for (const nodeId in nodesData) {
    if (nodesData.hasOwnProperty(nodeId)) {
        distances += `<p>Node ${nodeId}: ${nodesData[nodeId].distance}</p>`;
    }
}


function solveBranchAndBound(n, d) {
   let startNode = document.getElementById("startNodeInput").value

    const intialnode = graph.nodes._data[startNode]

    stopAnimation();
    // reset();
    let finalShortestPath = { length: Infinity, path: [] };
    var queue = new TinyQueue([], function (a, b) {
        if (a.approximation < b.approximation) return -1;
        if (a.approximation > b.approximation) return +1;
        return 0;
    });
    var initial = {
        id: intialnode.id,
        prevId: 0,
        path: [intialnode.id],
        length: 0,
        approximation: approximate([0], n, d)
    };
    // console.log(initial)
    var idCounter = 1;
    queue.push(initial);
    var result = { length: Infinity };
    var delay = 0;
    tree.nodes.add({
        id: initial.id,
        state: initial,
        x: intialnode.x,
        y: intialnode.y,
        distance: 0,
        color: treeRoot,
        label: ''+String.fromCharCode(65+initial.id)
    });
    var states = [initial];
    while (queue.length > 0) {
        var current = queue.peek();
        if (current.approximation >= result.length - 1e-9) break;
        queue.pop();
        current.used = true;
        if (current.id !== current.prevId) {
            setTimeout(function (state) {
                displayState(state);
                var from = graph.nodes.get(state.prevId);
                var to = graph.nodes.get(state.id);
                try{
                // dist = Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y));
                orignalEdges.forEach((element) => {
                    if(element.from == from.id && element.to == to.id) {
                        dist = parseInt(element.label)
                    }})
                }catch(e){
                dist = 10;
                }
                var position = treeNetwork.getPositions([state.prevId])[state.prevId];
                var x = position.x + randomInt(-dist, dist);
                var y = position.y + randomInt(-dist, dist);
                tree.nodes.add({
                    id: state.id,
                    state: state,
                    x: x,
                    y: y,
                    distance: dist,
                    label: '' + String.fromCharCode(65+state.path[state.path.length - 1])
                });
                tree.edges.add({
                    from: state.id,
                    to: state.prevId,
                });
            }, delay, current);            // console.log(tree.nodes, tree.edges)
            delay += 2000;
        }

        if (current.path.length === n) {
            if (current.length < result.length) {
                setTimeout(
                    function (state) {
                        var start = state.id;
                        while (state.prevId !== state.id) {
                            tree.edges.update({
                                from: state.id,
                                to: state.prevId,
                                color: treeResultEdge
                            });
                            tree.nodes.update({ id: state.id, color: treeResult });
                            state = states[state.prevId];
                        }
                        tree.nodes.update({ id: start, color: treeResultTail });
                    },
                    delay,
                    current
                );
                result = current;
                finalShortestPath.length = current.length;
                finalShortestPath.path = current.path;
            }
            continue;
        }
        var unused = [];
        for (var i = 0; i < n; i++) if (current.path.indexOf(i) === -1) unused.push(i);
        for (var j = 0; j < unused.length; j++) {
            var next = unused[j];
            var state = nextState(current, next, n, d);
            state.id = idCounter++;
            state.prevId = current.id;
            queue.push(state);
            states.push(state);
            // tree.nodes.add({id: state.id});
            // tree.edges.add({from: current.id, to: state.prevId});
        }
    }


   
    setTimeout(displayState, delay, result);
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        if (state.used && state.id != result.id) {
            setTimeout(function (state) {
                var inEdges = tree.edges.get().filter(function (edge) {
                    return edge.to === state.id;
                });
                if (inEdges.length === 0) {
                    tree.nodes.update({ id: state.id, color: treeBad });
                }
            }, delay, state);
        }
    }
    setTimeout(showResultPath, delay, finalShortestPath);

  



}

function showResultPath(data) {
    displayPath(data.path);
    var path_to_char = data.path.map(function (x) {
        return String.fromCharCode(65 + x);
    });
    
    document.getElementById('final_path').innerHTML = '<b>Shortest-Path:</b> ' + path_to_char.join('<-> ');
    document.getElementById('final_length').innerHTML = '<b>Nodes count:</b> ' + data.path.length;
    // document.getElementById('final_distance').innerHTML = '<b>Distance:</b> ' + tree.nodes[1];


}

function getPath(start, next) {
    var path = [];
    var v = start;
    do {
        path.push(v);
        v = next[v];
    } while (v !== start);
    return path;
}

function reverse(start, finish, next) {
    var p = next[start];
    var prev = start;
    do {
        var ne = next[p];
        next[p] = prev;
        prev = p;
        p = ne;
    } while (prev !== finish);
}


treeNetwork.on('click', function (param) {
    console.log('hi2');
    if (param.nodes.length > 0) {
        var state = tree.nodes.get(param.nodes[0]).state;
        displayState(state);
    }
});

function displayPath(path) {
    graph.edges.clear();
    var n = graph.nodes.length;
    for (var i = 0; i < n; i++) {
        var from = graph.nodes.get(path[i]);
        var to = graph.nodes.get(path[(i + 1) % n]);
        let label
        console.log(orignalEdges)
        orignalEdges.forEach((element) => {
            if((element.from == from.id && element.to == to.id) || (element.to == from.id && element.from == to.id) ) {
                label = element.label
            }})
        graph.edges.add({
            from: path[i],
            to: path[(i + 1) % n],
            // label: Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y)).toFixed(3)
            label : label
        });
    }
}

function displayState(state) {
    displayPath(state.path);
    var path_to_char = state.path.map(function (x) {
        return String.fromCharCode(65 + x);
    });
    info.innerHTML =

        //         // '<b>Approximation:</b> ' + state.approximation.toFixed(3) + '<br>' +
        '<b>Path:</b> ' + path_to_char.join('-> ');

    document.getElementById('shortest_path').innerHTML = '<b>Shortest Distance:</b> ' + state.length.toFixed(3)+ '<br>';
    if (path == '') path = "From Start Node: " + String.fromCharCode(65 + state.path[0]) + "<br>";

    for (var i = 0; i < state.path.length - 1; i++) {
        path += (i + 1) + ". Node <span style=\"color:green\">" + String.fromCharCode(65 + state.path[i + 1]) + "</span> is close to " +
            String.fromCharCode(65 + state.path[(i) % state.path.length]) + '  {'
            + state.path.slice(0, i + 2).map(code => String.fromCharCode(65 + code)).join('') + '}'
            + "<br>";
    }
    
    path += '----------<br>'
    document.getElementById('path Explanation').innerHTML = path;
}

function stopAnimation() {
    var timeout = setTimeout(function () {
    }, 0);
    while (timeout >= 0) {
        clearTimeout(timeout);
        timeout--;
    }
}


