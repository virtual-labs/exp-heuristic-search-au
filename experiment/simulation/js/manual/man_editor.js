
var nodes = graph.nodes;
var textArea = document.getElementById('editor');
document.getElementById("editor").disabled = true;

var maxNodesNumber = 100;

// Prefer using the shared `cityNames` array used in Random mode. Falls back to a local list if not available.
var manualCityNames = (window.cityNames && window.cityNames.length) ? window.cityNames.slice() : ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"];

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
    // update the start city dropdown to reflect added/removed cities
    updateStartCitySelect();
}

function updateStartCitySelect() {
    var sel = document.getElementById('startCitySelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">Select city</option>';
    for (var i = 0; i < nodes.length; i++) {
        var opt = document.createElement('option');
        opt.value = i;
        // Prefer full names (from Random mode) and fall back to a letter if name missing
        opt.text = (manualCityNames && manualCityNames[i]) ? manualCityNames[i] : String.fromCharCode(65 + i);
        sel.add(opt);
    }
}

// function resetTextArea() {
//     textArea.value = '';
//     // delete all nodes
//     nodes.clear();
// }


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
            label: '' + ((manualCityNames && manualCityNames[i]) ? manualCityNames[i].charAt(0).toUpperCase() : String.fromCharCode(65 + i)),
            title: (manualCityNames && manualCityNames[i]) ? manualCityNames[i] : String.fromCharCode(65 + i),
            x: x,
            y: y
        })



    }
    // connect all nodes randomly
    var edges = [];

    for (i = 0; i < size; i++) {
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

// refresh start city dropdown
updateStartCitySelect();

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
        } else {
            updateGraph();
        }
    } else {
        if (parseInt(textArea.value) >= 15 || parseInt(textArea.value) < 1) {


        } else {
            timer = setTimeout(function () {
                updateGraph();
            }, 1000);
        }
    }
});

graphNetwork.on('doubleClick', function doubleClick(params) {
    if (params.nodes.length === 0 && params.edges.length === 0 && nodes.length < maxNodesNumber) {
        var idx = nodes.length;
        nodes.add({
            id: idx,
            label: '' + ((manualCityNames && manualCityNames[idx]) ? manualCityNames[idx].charAt(0).toUpperCase() : String.fromCharCode(65 + idx)),
            title: (manualCityNames && manualCityNames[idx]) ? manualCityNames[idx] : String.fromCharCode(65 + idx),
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
    // update dropdown when user double-clicks new city
    updateStartCitySelect();



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

