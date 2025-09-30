let orignalEdges;
var info = document.getElementById('info');
var dist;
var path = '';

const simulationState = {
    INITIAL: 'initial',
    RUNNING: 'running',
    PAUSED: 'paused',
    FINISHED: 'finished'
};

let currentState = simulationState.INITIAL;

let simulation = {
    queue: null,
    states: [],
    idCounter: 1,
    result: { length: Infinity },
    finalShortestPath: { length: Infinity, path: [] },
    d: null
};

document.getElementById('nextbtn').addEventListener('click', nextStep);


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
    orignalEdges = new Array(graph.edges.length);
    graph.edges.forEach(element => {
        orignalEdges.push(element);
    });
    path = '';
    var nodes = graph.nodes;
    var n = nodes.length;
    simulation.d = new Array(n);

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

    const startIndex = cityNames.indexOf(startNodeInput.value);

    if (startIndex < 0 || startIndex >= n) {
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

    for (let i = 0; i < n; i++) {
        simulation.d[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            simulation.d[i][j] = 0;
        }
    }

    for (let i = 0; i < n; i++) {
        graph.edges.forEach((element) => {
            if (i == element.from) {
                simulation.d[i][element.to] = parseInt(element.label)
            }
        })
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (simulation.d[i][j] != 0) {
                simulation.d[j][i] = simulation.d[i][j]
            }
        }
    }
    solver(n, simulation.d, startIndex);
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

function solveBranchAndBound(n, d, startNodeIndex) {
    disableButton();

    stopAnimation();

    simulation.queue = new TinyQueue([], function (a, b) {
        if (a.approximation < b.approximation) return -1;
        if (a.approximation > b.approximation) return +1;
        return 0;
    });

    var initial = {
        id: startNodeIndex,
        prevId: startNodeIndex,
        path: [startNodeIndex],
        length: 0,
        approximation: approximate([startNodeIndex], n, d)
    };

    simulation.idCounter = 1;
    simulation.queue.push(initial);
    simulation.result = { length: Infinity };
    simulation.states = [initial];

    const initialNode = graph.nodes.get(startNodeIndex);

    tree.nodes.add({
        id: initial.id,
        state: initial,
        x: initialNode.x,
        y: initialNode.y,
        distance: 0,
        color: treeRoot,
        label: String.fromCharCode(65 + initial.id) + "\n" + cityNames[initial.id]
    });

    currentState = simulationState.RUNNING;
}

function nextStep() {
    if (currentState !== simulationState.RUNNING) return;

    if (simulation.queue.length > 0) {
        var current = simulation.queue.peek();

        if (current.approximation >= simulation.result.length - 1e-9) {
            currentState = simulationState.FINISHED;
            showResultPath(simulation.finalShortestPath);
            return;
        }

        simulation.queue.pop();
        current.used = true;

        if (current.id !== current.prevId) {
            displayState(current);
            var from = graph.nodes.get(current.prevId);
            var to = graph.nodes.get(current.id);
            try {
                orignalEdges.forEach((element) => {
                    if (element.from == from.id && element.to == to.id) {
                        dist = parseInt(element.label)
                    }
                })
            } catch (e) {
                dist = 10;
            }
            var position = treeNetwork.getPositions([current.prevId])[current.prevId];
            var x = position.x + randomInt(-dist, dist);
            var y = position.y + randomInt(-dist, dist);
            tree.nodes.add({
                id: current.id,
                state: current,
                x: x,
                y: y,
                distance: dist,
                label: '' + String.fromCharCode(65 + current.path[current.path.length - 1]) + "\n" + cityNames[current.path[current.path.length - 1]]
            });
            tree.edges.add({
                from: current.id,
                to: current.prevId,
            });
        }

        if (current.path.length === graph.nodes.length) {
            if (current.length < simulation.result.length) {
                var start = current.id;
                let tempState = current;
                while (tempState.prevId !== tempState.id) {
                    tree.edges.update({
                        from: tempState.id,
                        to: tempState.prevId,
                        color: treeResultEdge
                    });
                    tree.nodes.update({ id: tempState.id, color: treeResult });
                    tempState = simulation.states[tempState.prevId];
                }
                tree.nodes.update({ id: start, color: treeResultTail });

                simulation.result = current;
                simulation.finalShortestPath.length = current.length;
                simulation.finalShortestPath.path = current.path;
            }
        } else {
            var unused = [];
            for (var i = 0; i < graph.nodes.length; i++) if (current.path.indexOf(i) === -1) unused.push(i);
            for (var j = 0; j < unused.length; j++) {
                var next = unused[j];
                var state = nextState(current, next, graph.nodes.length, simulation.d);
                state.id = simulation.idCounter++;
                state.prevId = current.id;
                simulation.queue.push(state);
                simulation.states.push(state);
            }
        }
    } else {
        currentState = simulationState.FINISHED;
        showResultPath(simulation.finalShortestPath);
    }
}

function disableButton() {
    document.getElementById("submitbtn").onclick = function () { return false; };
    document.getElementById("submitbtn").style.backgroundColor = "#808080";
}

function showResultPath(data) {
    displayPath(data.path);
    var path_to_char = data.path.map(function (x) {
        return String.fromCharCode(65 + x) + "(" + cityNames[x] + ")";
    });

    document.getElementById('final_path').innerHTML = '<b>Shortest-Path:</b> ' + path_to_char.join('<-> ');
    document.getElementById('final_length').innerHTML = '<b>Nodes count:</b> ' + data.path.length;
}

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
    startNode = String.fromCharCode(65 + state.path[0]) + "(" + cityNames[state.path[0]] + ")";
    startPath += "Start Node: " + startNode;
    document.getElementById('path Explanation').innerHTML = startPath;
    for (let i = 0; i < state.path.length; i++) {
        graph.edges.forEach(element => {
            if (element.from == state.path[i] && element.to == state.path[(i + 1) % state.path.length]) {
                from = String.fromCharCode(65 + element.from) + "(" + cityNames[element.from] + ")";
                to = String.fromCharCode(65 + element.to) + "(" + cityNames[element.to] + ")";
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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
