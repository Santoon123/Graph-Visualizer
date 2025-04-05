import React from "react";
import CytoscapeComponent from "react-cytoscapejs";

const GraphView = ({ elements }) => {
    const defaultStylesheet = [
        {
            selector: "node",
            style: {
                shape: "ellipse",
                "background-color": "#666",
                label: "data(label)",
                color: "#fff",
                "text-outline-width": 1,
                "text-outline-color": "#555",
                "text-valign": "center",
                "text-halign": "center",
                "font-size": "12px",
                width: "35px",
                height: "35px",
            },
        },
        {
            selector: "edge",
            style: {
                width: 2,
                "line-color": "#ccc",
                "curve-style": "bezier",
                "target-arrow-shape": "none",
                "target-arrow-color": "#ccc",
                opacity: 0.8,
            },
        },
    ];

    console.log("Rendering GraphView with elements:", elements);
    return (
        <CytoscapeComponent
            elements={elements}
            className="react-cytoscapejs"
            stylesheet={defaultStylesheet}
            layout={{ name: "preset" }}
            minZoom={0.15}
            maxZoom={3.0}
            boxSelectionEnabled={false}
            autounselectify={true}
        />
    );
};

export default GraphView;
