var treeOptions = {
    physics: {
        enabled: true,
        stabilization: {
            enabled: true,
            iterations: 100,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true
        },
        barnesHut: {
            damping: 0.1,
            springConstant: 0.02
        }
    },
    edges: {
        color: {
            color: '#517cff',
            highlight: '#517cff',
            hover: '#517cff'
        },
        arrows: {
            to: {
                enabled: false
            },
            from: {
                enabled: true           
             }
        },
        smooth: false,
        chosen: true,
        font: {
            color: '#FFFFFF',
            size: 12, // px
            face: 'Roboto',
            background: '#343434',
            strokeWidth: 0,
            align: 'horizontal'
        },
        labelHighlightBold: true,
        selectionWidth: 1,
        selfReferenceSize: 20,
        width: 3,
        widthConstraint: false
    },
    nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        font: {
            color: '#343434',
            size: 14,
            face: 'Roboto',
            strokeWidth: 0,
            align: 'center',
            vadjust: -40
        },
        shape: 'dot',
        size: 20
    },
    interaction: {
        dragView: true,
        zoomView: true
    }
  };
  
  var graphOptions = {
    physics: {
        enabled: false
    },
    edges: {
        arrows: {
            to: {
                enabled: false
            },
            from: {
                enabled: false
            }
        },
        smooth: false,
        chosen: true,
        font: {
            color: '#FFFFFF',
            size: 6, // px
            face: 'Roboto',
            background: 'rgba(0, 0, 0, 0.5)',
            strokeWidth: 0,
            align: 'horizontal'
        },
        labelHighlightBold: true,
        selectionWidth: 1,
        selfReferenceSize: 20,
        width: 1,
        widthConstraint: false
    },
    nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        font: {
            color: '#343434',
            size: 12,
            face: 'Roboto',
            strokeWidth: 0,
            align: 'center',
            vadjust: -35
        },
        shape: 'dot',
        size: 12
    },
    interaction: {
        dragView: true,
        zoomView: true
    }
  };
  
  var treeRoot = {
      border: '#18ab17',
      background:'#c7fcb4' ,
      highlight: {
          border: '#18ab17',
          background: '#c7fcb4'
      },
      hover: {
          border: '#c7fcb4',
          background: '#18ab17'
      }
  };
  
  var treeResult = {
    border: '#18ab17',
    background: '#c7fcb4',
    highlight: {
        border: '#18ab17',
        background: '#c7fcb4'
    },
    hover: {
        border: '#18ab17',
        background: '#c7fcb4'
    }
  };
  
  var treeBad = {
    border: '#d51913',
    background: '#fc817f',
    highlight: {
        border: '#d51913',
        background: '#fc817f'
    },
    hover: {
        border: '#d51913',
        background: '#fc817f'
    }
  };
  
  var treeResultTail = {
    border: '#138412',
    background: '#48fc3e',
    highlight: {
        border: '#138412',
        background: '#48fc3e'
    },
    hover: {
        border: '#138412',
        background: '#48fc3e'
    }
  };
  
  var treeResultEdge = {
    color: '#18ab17',
    highlight: '#18ab17',
    hover: '#18ab17'
  };