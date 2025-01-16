import React, { useState } from "react";
import GraphInput from "./components/GraphInput";
import GraphView from "./components/GraphView";
import "./App.css";
const App = () => {
    const [edges, setEdges] = useState("[[1, 2], [2, 3]]");
    const [elements, setElements] = useState([]);

    const updateGraph = () => {
        try {
            const parsedEdges = JSON.parse(edges);
            const newElements = [];
            const nodes = new Set();
            parsedEdges.forEach(([source, target]) => {
                nodes.add(source);
                nodes.add(target);
                newElements.push({
                    data: { id: `${source}-${target}`, source, target },
                    style: {
                        "line-color": "black",
                    },
                });
            });
            let index = 0;
            const nodeCount = nodes.size;
            const centerX = 700;
            const centerY = 300;
            const radius = 100;
            nodes.forEach((node) => {
                const angle = (index / nodeCount) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                newElements.push({
                    data: { id: node, label: `Node ${node}` },
                    position: { x, y },
                    style: {
                        "background-color": "purple",
                    },
                });
                index++;
            });
            setElements(newElements);
        } catch (error) {
            alert("Invalid edge format! Use [[a, b], [b, c]]");
        }
    };
    return (
        <div id="container">
            <h1 id="Heading-of-project">Graph Visualizer</h1>
            <div id="Input-section">
                <GraphInput edges={edges} setEdges={setEdges} />
                <button onClick={updateGraph}>Visualize Graph</button>
            </div>
            <div id="Graph-section">
                <GraphView elements={elements} />
            </div>
        </div>
    );
};
export default App;
