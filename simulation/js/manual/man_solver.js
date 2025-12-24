let orignalEdges;
var info = document.getElementById('info');
var dist;
var path = '';

// Helper: get the city letter from the graph node's title (fallback to A/B/C...)
function getCityLetter(idx) {
    var node = graph.nodes.get(idx);
    if (node && node.title) return node.title.charAt(0).toUpperCase();
    return String.fromCharCode(65 + idx);
}

//let originalGraph

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

    // deep copy javascript object
    // originalGraph = JSON.parse(JSON.stringify(graph))

    orignalEdges = new Array(graph.edges.length);
    graph.edges.forEach(element => {
        orignalEdges.push(element);
    });
    path = '';
    var nodes = graph.nodes;
    var n = nodes.length;
    var d = new Array(n);
    // If manual UI has a start city select, create a small proxy object so existing code (which expects an input) keeps working.
    var startCitySelect = document.getElementById('startCitySelect');
    if (startCitySelect) {
        var startNodeInput = {
            get value() {
                return startCitySelect.value !== '' ? String.fromCharCode(65 + parseInt(startCitySelect.value, 10)) : '';
            },
            set value(v) {
                if (!startCitySelect) return;
                if (v === '') { startCitySelect.value = ''; return; }
                if (typeof v === 'string' && isNaN(v)) {
                    startCitySelect.value = String(v.toUpperCase().charCodeAt(0) - 65);
                } else {
                    startCitySelect.value = String(parseInt(v, 10));
                }
            },
            focus: function () { startCitySelect.focus(); }
        };
    }

    var startNodeInput = (typeof startNodeInput !== 'undefined' && startNodeInput) ? startNodeInput : document.getElementById("startNodeInput");
    let popup1 = document.getElementById("popup1");
    let popup2 = document.getElementById("popup2");
    if (!startNodeInput.value) {
        if (!popup2) {
            popup2 = document.createElement("div");
            popup2.id = "popup2";

            popup2.innerHTML = `
          <div class="overlay2">
            <div class="popup2">
              <h2>Please select a start city</h2>
              <a class="close2" href="#popup2">&times;</a>
            </div>
          </div>
        `;
            document.body.appendChild(popup2);

            let closePopupAnchor = popup2.querySelector(".close2");
            closePopupAnchor.addEventListener("click", function (event) {
                event.preventDefault();
                var _sel = document.getElementById('startCitySelect'); if (_sel) _sel.value = ''; else if (typeof startNodeInput !== 'undefined' && startNodeInput) startNodeInput.value = '';
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
    if (startNodeInput.value < 0 || startNodeInput.value >= n) {
        if (!popup1) {
            popup1 = document.createElement("div");
            popup1.id = "popup1";

            popup1.innerHTML = `
            <div class="overlay1">

            <div class="popup1">
                <h2>Please select a valid start city</h2>
                <a class="close1" href="#popup1">&times;</a>
            </div>
            </div>
        `;
            document.body.appendChild(popup1);

            let closePopupAnchor = popup1.querySelector(".close1");
            closePopupAnchor.addEventListener("click", function (event) {
                event.preventDefault();
                var _sel = document.getElementById('startCitySelect'); if (_sel) _sel.value = ''; else if (typeof startNodeInput !== 'undefined' && startNodeInput) startNodeInput.value = '';
                popup1.style.display = "none";
            });
        } else {
            popup1.style.display = "block";
        }
        startNodeInput.focus();
        return;
    }
    for (let i = 0; i < n; i++) {
        d[i] = new Array(n);
        // Set all intitial to zero
        for (let j = 0; j < n; j++) {
            d[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        graph.edges.forEach((element) => {
            if (i == element.from) {
                d[i][element.to] = parseInt(element.label)
            }
        })
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (d[i][j] != 0) {
                d[j][i] = d[i][j]
            }
        }
    }    // show the iteration panel only when the solver actually starts
    var his = document.getElementById('heuristicIterationSection');
    if (his) {
        his.style.display = 'block';
        var pathExp = document.getElementById('path Explanation');
        if (pathExp) pathExp.innerHTML = '';
    } solver(n, d);
    updateTextArea1()
}
function updateTextArea1() {
    startNodeInput.value = String.fromCharCode(parseInt(startNodeInput.value) + 65);
}

function reset() {
    tree.nodes.clear();
    tree.edges.clear();
    graph.edges.clear();
    info.innerHTML = '';
    nodes.clear();
    clearText();
    document.getElementById("shortest_path").innerHTML = "";
    document.getElementById('path Explanation').innerHTML = '';
    location.reload();
}

function resetOnlyResult() {
    window.alert("The graph will be reseted.")
    tree.nodes.clear();
    tree.edges.clear();
    graph.edges.clear();
    info.innerHTML = '';
    nodes.clear();
    clearText();
    document.getElementById("shortest_path").innerHTML = "";
    updateTextArea();
    document.getElementById('path Explanation').innerHTML = '';
    location.reload();
}

const nodesData = tree.nodes._data;
let distances = "";
for (const nodeId in nodesData) {
    if (nodesData.hasOwnProperty(nodeId)) {
        distances += `<p>City ${nodeId}: ${nodesData[nodeId].distance}</p>`;
    }
}

function disableButton() {
    //disable click
    document.getElementById("submitbtn").onclick = function () { return false; };

    document.getElementById("submitbtn").style.backgroundColor = "#808080";


}
function solveBranchAndBound(n, d) {
    disableButton();
    var sel = document.getElementById('startCitySelect');
    let startNode;
    if (sel && sel.value !== '') {
        startNode = parseInt(sel.value, 10);
    } else {
        var raw = document.getElementById("startNodeInput") ? document.getElementById("startNodeInput").value : '';
        raw = raw.toUpperCase();
        startNode = raw ? (raw.charCodeAt(0) - 65) : 0;
    }

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
        label: '' + getCityLetter(initial.id)
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
                try {
                    // dist = Math.sqrt((from.x - to.x) * (from.x - to.x) + (from.y - to.y) * (from.y - to.y));
                    orignalEdges.forEach((element) => {
                        if (element.from == from.id && element.to == to.id) {
                            dist = parseInt(element.label)
                        }
                    })
                } catch (e) {
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
                    label: '' + getCityLetter(state.path[state.path.length - 1])
                });
                tree.edges.add({
                    from: state.id,
                    to: state.prevId,
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
    for (i = 0; i < states.length; i++) {
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
        var node = graph.nodes.get(x);
        if (node && node.title) return node.title.charAt(0).toUpperCase();
        return String.fromCharCode(65 + x);
    });

    document.getElementById('final_path').innerHTML = '<b>Shortest-Path:</b> ' + path_to_char.join('<-> ');
    document.getElementById('final_length').innerHTML = '<b>Cities count:</b> ' + data.path.length;
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
        orignalEdges.forEach((element) => {
            if ((element.from == from.id && element.to == to.id) || (element.to == from.id && element.from == to.id)) {
                label = element.label
            }
        })
        graph.edges.add({
            from: path[i],
            to: path[(i + 1) % n],
            label: label
        });
    }
}

function displayState(state) {
    displayPath(state.path);
    var startNode;
    var startPath = "";
    var neighbourPath = "";
    startNode = String.fromCharCode(65 + state.path[0]);
    startPath += "Start City: " + startNode;
    document.getElementById('path Explanation').innerHTML = startPath;
    for (let i = 0; i < state.path.length; i++) {
        graph.edges.forEach(element => {
            //if the neighbourPath undefined
            if (element.from == state.path[i] && element.to == state.path[(i + 1) % state.path.length]) {
                from = String.fromCharCode(65 + element.from);
                to = String.fromCharCode(65 + element.to);
                neighbourPath = document.createElement('div')
                neighbourPath.innerHTML = " H(" + from + "," + to + ") = " + element.label;

            }

        });
        document.getElementById('path Explanation').append(neighbourPath)
        document.getElementById('shortest_path').innerHTML = '<b>Shortest Distance:</b> ' + state.length.toFixed(3) + '<br>';

    }

}

function stopAnimation() {
    var timeout = setTimeout(function () {
    }, 0);
    while (timeout >= 0) {
        clearTimeout(timeout);
        timeout--;
    }
}


