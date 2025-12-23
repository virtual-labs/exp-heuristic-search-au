var nodes = graph.nodes;
var maxNodesNumber = 15;

const cityNames = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];
// expose for manual mode to reuse the same city name list
window.cityNames = cityNames;

window.onload = function () {
    // No default value set, user needs to enter first.
    // generateGraph() will be called on 'input' event of numCities.
    // transiently highlight the initial instruction on load
    var initLine = document.getElementById('instr-enter-cities');
    if (initLine) {
        initLine.classList.add('instruction-highlight');
        setTimeout(function () { initLine.classList.remove('instruction-highlight'); }, 2500);
    }
};

document.getElementById('numCities').addEventListener('input', generateGraph);
document.getElementById('startCity').addEventListener('change', function () {
    var val = parseInt(document.getElementById('startCity').value);
    if (val >= 0) { // Check if a valid city is selected
        document.getElementById('solveResetContainer').style.display = 'block';
        // Append 'click solve' instruction as a new line if not already present and highlight it
        var instructionInline = document.getElementById('instructionInline');
        if (instructionInline) {
            instructionInline.style.display = 'block';
            if (!document.getElementById('instr-click-solve')) {
                var line2 = document.createElement('div');
                line2.id = 'instr-click-solve';
                line2.className = 'instruction-inline-line';
                line2.textContent = 'Click the Solve button to find the shortest path.';
                instructionInline.appendChild(line2);
                line2.classList.add('instruction-highlight');
                setTimeout(function () { line2.classList.remove('instruction-highlight'); }, 2500);
            }
        }
    } else {
        document.getElementById('solveResetContainer').style.display = 'none';
        var instructionInline = document.getElementById('instructionInline'); if (instructionInline) {
            var clickLine = document.getElementById('instr-click-solve'); if (clickLine) clickLine.remove();
            // hide container if no lines remain
            if (instructionInline.querySelectorAll('.instruction-inline-line').length === 0) instructionInline.style.display = 'none';
        }
    }
});

function generateGraph() {
    var numCities = parseInt(document.getElementById('numCities').value);

    if (isNaN(numCities) || numCities < 2 || numCities > maxNodesNumber) {
        // If invalid input, hide containers
        document.getElementById('startCityContainer').style.display = 'none';
        document.getElementById('solveResetContainer').style.display = 'none';
        // Hide and clear any inline instruction lines
        var ins = document.getElementById('instructionInline'); if (ins) { ins.style.display = 'none'; ins.innerHTML = ''; }
        // Hide and clear legend if present
        var leg = document.getElementById('graphLegend'); if (leg) { leg.classList.add('hidden'); leg.setAttribute('aria-hidden', 'true'); leg.innerHTML = ''; }
        // Clear graph if any
        nodes.clear();
        graph.edges.clear();
        return;
    }

    updateGraph(numCities);

    // Show a contextual next instruction inline and highlight the new line briefly
    var instructionInline = document.getElementById('instructionInline');
    if (instructionInline) {
        instructionInline.style.display = 'block';
        if (!document.getElementById('instr-select-start')) {
            var line = document.createElement('div');
            line.id = 'instr-select-start';
            line.className = 'instruction-inline-line';
            line.textContent = 'Now select a start city from the dropdown below.';
            instructionInline.appendChild(line);
            line.classList.add('instruction-highlight');
            setTimeout(function () { line.classList.remove('instruction-highlight'); }, 2500);
        }
    }

    var startCitySelect = document.getElementById('startCity');
    startCitySelect.innerHTML = '';
    var option = document.createElement('option');
    option.text = "Select Start City";
    option.value = "-1"; // Use a value that indicates no selection
    option.disabled = true;
    option.selected = true;
    startCitySelect.add(option);
    for (var i = 0; i < numCities; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = cityNames[i];
        startCitySelect.add(option);
    }

    document.getElementById('startCityContainer').style.display = 'block';
    document.getElementById('solveResetContainer').style.display = 'none'; // Keep hidden until city is selected
}

function updateGraph(size) {
    nodes.clear();
    for (var i = 0; i < size; i++) {
        var x = Math.floor(Math.random() * 200);
        var y = Math.floor(Math.random() * 200) - 100;
        nodes.add({
            id: i,
            label: cityNames[i].charAt(0),
            title: cityNames[i],
            x: x,
            y: y
        });
    }

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
    graphNetwork.fit();

    // Populate legend mapping letters to city names (group duplicates)
    var legend = document.getElementById('graphLegend');
    if (legend) {
        var map = {};
        for (var i = 0; i < size; i++) {
            var letter = cityNames[i].charAt(0);
            if (!map[letter]) map[letter] = [];
            map[letter].push(cityNames[i]);
        }
        var keys = Object.keys(map).sort();
        var html = '<div class="legend-title">City legend</div>';
        keys.forEach(function (k) {
            html += '<div class="legend-item">';
            html += '<div class="legend-key">' + k + '</div>';
            html += '<div class="legend-val">' + map[k].join(', ') + '</div>';
            html += '</div>';
        });
        legend.innerHTML = html;
        // Show legend now that it's populated
        legend.classList.remove('hidden');
        legend.setAttribute('aria-hidden', 'false');
    }
}

graphNetwork.on('dragEnd', function (params) {
    if (params.nodes.length > 0) {
        var node = nodes.get(params.nodes[0]);
        nodes.update({
            id: node.id,
            x: Math.trunc(params.pointer.canvas.x),
            y: Math.trunc(params.pointer.canvas.y)
        });
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
        });
    }
});
