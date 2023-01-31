
// var nodes = new vis.DataSet([
//     {id: 1, label: 'Node 1'},
//     {id: 2, label: 'Node 2'},
//     {id: 3, label: 'Node 3'},
//     {id: 4, label: 'Node 4'},
//     {id: 5, label: 'Node 5'},
//     {id: 6, label: 'Node 6'},
//     {id: 7, label: 'Node 7'},
//     {id: 8, label: 'Node 8'},
//     {id: 9, label: 'Node 9'},
//     {id: 10, label: 'Node 10'}
//     ]);

    
//     var edges = new vis.DataSet([
//     {from: 1, to: 2, label: 'Edge 1'},
//     {from: 1, to: 3, label: 'Edge 2'},
//     {from: 2, to: 4, label: 'Edge 3'},
//     {from: 2, to: 5, label: 'Edge 4'},
//     {from: 3, to: 6, label: 'Edge 5'},
//     {from: 3, to: 7, label: 'Edge 6'},
//     {from: 4, to: 8, label: 'Edge 7'},
//     {from: 5, to: 9, label: 'Edge 8'},
//     {from: 6, to: 10, label: 'Edge 9'},
//     {from: 7, to: 10, label: 'Edge 10'}
//     ]);
//     var data = {
//         nodes: nodes,
//         edges: edges
//         };
var treeContainer = document.getElementById('tree');
var graphContainer = document.getElementById('graph');
var tree = {
    nodes: new vis.DataSet(),
    edges: new vis.DataSet()
};
var graph = {
    nodes: new vis.DataSet(),
    edges: new vis.DataSet()
};
//var treeOptions = {};
//var graphOptions = {};
var treeNetwork = new vis.Network(
    treeContainer,
    {nodes: tree.nodes, edges: tree.edges},
    treeOptions
);
var graphNetwork = new vis.Network(
    graphContainer,
    {nodes: graph.nodes, edges: graph.edges},
    graphOptions
);

    // tree.nodes.add({id: i, label: "A"});
    // graph.nodes.add({id: i, label: "A"});
    // for (var i = 1; i <= nodes.length; i++) {
    //     var letter = String.fromCharCode(i + 64); // convert the number to a letter using ASCII code
    //     tree.nodes.update({id: i, label: letter});
    //     graph.nodes.update({id: i, label: letter});
    // }
    


window.onload = function() { 
    // Call the function when the user submits their start and end nodes
    document.getElementById("submitNodesButton").addEventListener("click", function() {
    var startNode = document.getElementById("startNodeInput").value;
    var endNode = document.getElementById("endNodeInput").value;
    updateGraphWithStartEndNode();
    });
}
function updateGraphWithStartEndNode() {
    startNode = document.getElementById("startNodeInput").value
    endNode = document.getElementById("endNodeInput").value
    solveBranchAndBound(n, d);
    graphNetwork.fit();

}
// function createTree() {
//     // create nodes and edges for the tree
//     var rootNode = {id: 1, label: 'Root', color: 'blue'};
//     var childNode1 = {id: 2, label: 'Child 1', color: 'green'};
//     var childNode2 = {id: 3, label: 'Child 2', color: 'green'};
//     var grandchildNode1 = {id: 4, label: 'Grandchild 1', color: 'yellow'};
//     var grandchildNode2 = {id: 5, label: 'Grandchild 2', color: 'yellow'};
//     tree.nodes.add([rootNode, childNode1, childNode2, grandchildNode1, grandchildNode2]);
// tree.edges.add([
//     {from: 1, to: 2},
//     {from: 1, to: 3},
//     {from: 2, to: 4},
//     {from: 2, to: 5}
// ]);
// }

// function createGraph() {
//     // create nodes and edges for the graph
//     var node1 = {id: 1, label: 'Node 1', color: 'red'};
//     var node2 = {id: 2, label: 'Node 2', color: 'red'};
//     var node3 = {id: 3, label: 'Node 3', color: 'red'};
//     var node4 = {id: 4, label: 'Node 4', color: 'red'};
//     var node5 = {id: 5, label: 'Node 5', color: 'red'};
//     graph.nodes.add([node1, node2, node3, node4, node5]);
// graph.edges.add([
//     {from: 1, to: 2},
//     {from: 2, to: 3},
//     {from: 3, to: 4},
//     {from: 4, to: 5},
//     {from: 1, to: 5}
// ]);
// }
// createTree();
// createGraph();

// var treeOptions = {
// layout: {
// hierarchical: {
// direction: 'UD',
// sortMethod: 'undirected'
// }
// }
// };

// var graphOptions = {
// layout: {
// randomSeed: 4
// }
// };

// treeNetwork.setOptions(treeOptions);
// graphNetwork.setOptions(graphOptions);
















// window.onload = function () {
//     var textArea = document.getElementById('editor');
//     var randomNumber = Math.floor(Math.random() * 15) + 1; // generates random number between 1 and 15
//     textArea.value = randomNumber;
// };


// window.onload = function () {};
// function updateGraphWithStartEndNode(startNode, endNode) {
//     graph.edges.update({id: 0, from: startNode, to: endNode});
//     solveBranchAndBound(nodes.length, d);
//     graphNetwork.fit();
// }
    
//     // Call the function when the user submits their start and end nodes
//     document.getElementById("submitNodesButton").addEventListener("click", function() {
//     var startNode = document.getElementById("startNodeInput").value;
//     var endNode = document.getElementById("endNodeInput").value;
//     updateGraphWithStartEndNode(startNode, endNode);
//     });