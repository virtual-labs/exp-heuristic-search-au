var info = document.getElementById('info');
var dist;
let path = '';

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
    path = '';
    var nodes = graph.nodes;
    var n = nodes.length;
    var d = new Array(n);

    const startNode = parseInt(document.getElementById("startCity").value);

    if (isNaN(startNode) || startNode < 0 || startNode >= n) {
        alert("Please select a valid start city.");
        return;
    }

    document.getElementById('heuristicIterationSection').style.display = 'block'; // Show iteration section

    for (var i = 0; i < n; i++) {
        d[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            var dx = nodes.get(i).x - nodes.get(j).x;
            var dy = nodes.get(i).y - nodes.get(j).y;
            d[i][j] = Math.sqrt(dx * dx + dy * dy);
        }
    }
    solver(n, d, startNode);
}

function reset() {
    stopAnimation();
    tree.nodes.clear();
    tree.edges.clear();
    info.innerHTML = '';
    document.getElementById("shortest_path").innerHTML = "";
    document.getElementById('path Explanation').innerHTML = '';
    document.getElementById('final_path').innerHTML = '';
    document.getElementById('heuristicIterationSection').style.display = 'none'; // Hide iteration section
    document.getElementById('startCityContainer').style.display = 'none';
    document.getElementById('solveResetContainer').style.display = 'none';
    document.getElementById('numCities').removeAttribute("readonly");
    document.getElementById('submitbtn').style.backgroundColor = '';
    document.getElementById("submitbtn").onclick = function () { solvePlanar(solveBranchAndBound); };
    generateGraph();
}

const nodesData = tree.nodes._data;
let distances = "";
for (const nodeId in nodesData) {
    if (nodesData.hasOwnProperty(nodeId)) {
        distances += `<p>Node ${nodeId}: ${nodesData[nodeId].distance}</p>`;
    }
}

function solveBranchAndBound(n, d, startNode) {
    disableButton();
    const intialnode = graph.nodes._data[startNode];

    stopAnimation();
    let finalShortestPath = {
        length: Infinity,
        path: []
    };
    var queue = new TinyQueue([], function (a, b) {
        if (a.approximation < b.approximation) return -1;
        if (a.approximation > b.approximation) return +1;
        return 0;
    });
    var initial = {
        id: 0,
        prevId: 0,
        path: [startNode],
        length: 0,
        approximation: approximate([startNode], n, d)
    };
    var idCounter = 1;
    queue.push(initial);
    var result = {
        length: Infinity
    };
    var delay = 0;
    tree.nodes.add({
        id: initial.id,
        state: initial,
        x: intialnode.x,
        y: intialnode.y,
        distance: -80,
        color: treeRoot,
        label: cityNames[startNode].charAt(0),
        title: cityNames[startNode]
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
                dist = tree.nodes.get(state.prevId).distance;

                var position = treeNetwork.getPositions([state.prevId])[state.prevId];
                var x = position.x + randomInt(-dist, dist);
                var y = position.y + randomInt(-dist, dist);
                tree.nodes.add({
                    id: state.id,
                    state: state,
                    x: x,
                    y: y,
                    distance: dist * 0.8,
                    label: cityNames[state.path[state.path.length - 1]].charAt(0),
                    title: cityNames[state.path[state.path.length - 1]]
                });
                tree.edges.add({
                    from: state.id,
                    to: state.prevId
                });
            }, delay, current);
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
                            tree.nodes.update({
                                id: state.id,
                                color: treeResult
                            });
                            state = states[state.prevId];
                        }
                        tree.nodes.update({
                            id: start,
                            color: treeResultTail
                        });
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
        for (i = 0; i < n; i++)
            if (current.path.indexOf(i) === -1) unused.push(i);
        for (var j = 0; j < unused.length; j++) {
            var next = unused[j];
            state = nextState(current, next, n, d);
            state.id = idCounter++;
            state.prevId = current.id;
            queue.push(state);
            states.push(state);
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
                    tree.nodes.update({
                        id: state.id,
                        color: treeBad
                    });
                }
            }, delay, state);
        }
    }
    setTimeout(showResultPath, delay, finalShortestPath);

}

function disableButton() {
    document.getElementById("submitbtn").onclick = function () {
        return false;
    };
    document.getElementById("submitbtn").style.backgroundColor = "#808080";
}

function showResultPath(data) {
    displayPath(data.path);
    var path_to_char = data.path.map(function (x) {
        return cityNames[x];
    });
    document.getElementById('final_path').innerHTML = '<b>Shortest-Path:</b> ' + path_to_char.join(' -> ');
    document.getElementById('final_length').innerHTML = '<b>Nodes count:</b> ' + data.path.length;
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
    if (param.nodes.length > 0) {
        var state = tree.nodes.get(param.nodes[0]).state;
        displayState(state);
    }
});

function displayPath(path) {
    if (!path || path.length === 0) return;
    graph.edges.clear();
    var n = graph.nodes.length;
    for (var i = 0; i < n; i++) {
        var from = graph.nodes.get(path[i]);
        var to = graph.nodes.get(path[(i + 1) % n]);
        if (from && to) {
            graph.edges.add({
                from: path[i],
                to: path[(i + 1) % n],
                label: Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y)).toFixed(3)
            });
        }
    }
}

function displayState(state) {
    if (!state || !state.path) return;
    displayPath(state.path);
    var startNode;
    var startPath = "";
    var neighbourPath = "";
    startNode = cityNames[state.path[0]];
    startPath += "Start City: " + startNode;
    document.getElementById('path Explanation').innerHTML = startPath;
    for (let i = 0; i < state.path.length; i++) {
        graph.edges.forEach(element => {
            if (element.from == state.path[i] && element.to == state.path[(i + 1) % state.path.length]) {
                from = cityNames[element.from];
                to = cityNames[element.to];
                neighbourPath = document.createElement('div')
                neighbourPath.innerHTML = " H(" + from + "," + to + ") = " + element.label;

            }

        });
        document.getElementById('path Explanation').append(neighbourPath)
        if (state.length) {
            document.getElementById('shortest_path').innerHTML = '<b>Shortest Distance:</b> ' + state.length.toFixed(3) + '<br>';
        }
    }

}

function stopAnimation() {
    var timeout = setTimeout(function () { }, 0);
    while (timeout >= 0) {
        clearTimeout(timeout);
        timeout--;
    }
}