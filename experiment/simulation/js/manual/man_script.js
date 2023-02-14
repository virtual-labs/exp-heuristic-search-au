
var treeContainer = document.getElementById('tree');
var graphContainer = document.getElementById('graph');

var tree = {
    nodes: new vis.DataSet(),
    edges: new vis.DataSet()
};
var graph = {
    nodes: new vis.DataSet(),
    edges: new vis.DataSet(),
    
    
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
    graphOptions,
    
      
);

window.onload = function() {
    document.getElementById("random").style.backgroundColor = "lightblue";
  };
  
  document.getElementById("random").onclick = function() {
    document.getElementById("random").style.backgroundColor = "lightblue";
    document.getElementById("manual").style.backgroundColor = "";
  };
  
  document.getElementById("manual").onclick = function() {
    document.getElementById("manual").style.backgroundColor = "lightblue";
    document.getElementById("random").style.backgroundColor = "";
  };
  


