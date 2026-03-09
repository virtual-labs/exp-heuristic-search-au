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
            color: '#c7c7c7',
            highlight: '#9aa8ff',
            hover: '#9aa8ff'
        },
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
            color: '#222222',
            size: 10, // px
            face: 'Roboto',
            background: 'transparent',
            strokeWidth: 0,
            align: 'horizontal'
        },
        labelHighlightBold: true,
        selectionWidth: 1,
        selfReferenceSize: 20,
        width: 2,
        widthConstraint: false
    },
    nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
            background: '#6b7bff',
            border: '#2f43b5',
            highlight: {
                background: '#8fa1ff',
                border: '#1f2f8f'
            },
            hover: {
                background: '#8fa1ff',
                border: '#1f2f8f'
            }
        },
        font: {
            color: '#ffffff',
            size: 14,
            face: 'Roboto',
            strokeWidth: 0,
            align: 'center',
            vadjust: -30
        },
        shape: 'dot',
        size: 16,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.12)',
            size: 10,
            x: 0,
            y: 6
        }
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
            size: 8, // px
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
        color: {
            background: '#6b7bff',
            border: '#2f43b5',
            highlight: {
                background: '#8fa1ff',
                border: '#1f2f8f'
            },
            hover: {
                background: '#8fa1ff',
                border: '#1f2f8f'
            }
        },
        font: {
            color: '#ffffff',
            size: 14,
            face: 'Roboto',
            strokeWidth: 0,
            align: 'center',
            vadjust: -30
        },
        shape: 'dot',
        size: 16,
        shadow: {
            enabled: true,
            color: 'rgba(0,0,0,0.12)',
            size: 10,
            x: 0,
            y: 6
        }
    },
    interaction: {
        dragView: true,
        zoomView: true
    }
};

var treeRoot = {
    border: '#18ab17',
    background: '#c7fcb4',
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