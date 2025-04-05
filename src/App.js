import React, { useState, useEffect, useCallback } from "react";
import GraphInput from "./components/GraphInput";
import GraphView from "./components/GraphView";
import "./App.css";
const DEFAULT_NODE_COLOR = "purple";
const DEFAULT_EDGE_COLOR = "grey";
const VISITED_COLOR_DFS = "green";
const BFS_COLORS = [
    "red",
    "orange",
    "yellow",
    "lime",
    "cyan",
    "blue",
    "violet",
];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
    const [edges, setEdges] = useState(
        "[[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [5, 7], [6, 8], [7, 8]]"
    );
    const [elements, setElements] = useState([]);
    const [nodesMap, setNodesMap] = useState(new Map());
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [traversalOutput, setTraversalOutput] = useState("");
    const updateGraph = useCallback(() => {
        if (isVisualizing) return;
        try {
            const parsedEdges = JSON.parse(edges);
            const newElements = [];
            const nodes = new Set();
            const tempNodesMap = new Map();
            parsedEdges.forEach(([source, target], index) => {
                const sourceStr = String(source);
                const targetStr = String(target);
                nodes.add(sourceStr);
                nodes.add(targetStr);
                newElements.push({
                    data: {
                        id: `e-${sourceStr}-${targetStr}-${index}`,
                        source: sourceStr,
                        target: targetStr,
                    },
                    style: {
                        "line-color": DEFAULT_EDGE_COLOR,
                        width: 2,
                    },
                });
            });
            let index = 0;
            const nodeCount = nodes.size;
            const graphContainer = document.getElementById("Graph-section");
            const containerWidth = graphContainer?.clientWidth || 1300;
            const containerHeight = graphContainer?.clientHeight || 600;
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const radius = Math.min(centerX, centerY) * 0.6;

            nodes.forEach((nodeId) => {
                const angle = (index / nodeCount) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                const nodeElement = {
                    data: { id: nodeId, label: `Node ${nodeId}` },
                    position: { x, y },
                    style: {
                        "background-color": DEFAULT_NODE_COLOR,
                        label: "data(label)",
                        color: "white",
                        "text-outline-color": "black",
                        "text-outline-width": 1,
                    },
                };
                newElements.push(nodeElement);
                tempNodesMap.set(nodeId, nodeElement);
                index++;
            });

            setElements(newElements);
            setNodesMap(tempNodesMap);
            setTraversalOutput("");
            console.log("Graph Updated. Elements:", newElements);
        } catch (error) {
            console.error("Error parsing edges:", error);
            alert(
                "Invalid edge format! Please use JSON format like [[1, 2], [2, 3]]. Check console for details."
            );
            setElements([]);
            setNodesMap(new Map());
            setTraversalOutput("Error loading graph.");
        }
    }, [edges, isVisualizing]);
    useEffect(() => {
        updateGraph();
    }, []);
    const createAdjacencyList = useCallback(() => {
        const adjList = new Map();
        try {
            const parsedEdges = JSON.parse(edges);
            parsedEdges.forEach(([source, target]) => {
                const sourceStr = String(source);
                const targetStr = String(target);

                if (!adjList.has(sourceStr)) adjList.set(sourceStr, []);
                if (!adjList.has(targetStr)) adjList.set(targetStr, []);

                if (!adjList.get(sourceStr).includes(targetStr)) {
                    adjList.get(sourceStr).push(targetStr);
                }
                if (!adjList.get(targetStr).includes(sourceStr)) {
                    adjList.get(targetStr).push(sourceStr);
                }
            });
        } catch {
            return new Map();
        }
        return adjList;
    }, [edges]);
    const resetVisualization = () => {
        setTraversalOutput("");
        setElements((prevElements) =>
            prevElements.map((el) => {
                if (el.data.source) {
                    // Edge
                    return {
                        ...el,
                        style: {
                            ...el.style,
                            "line-color": DEFAULT_EDGE_COLOR,
                        },
                    };
                } else {
                    return {
                        ...el,
                        style: {
                            ...el.style,
                            "background-color": DEFAULT_NODE_COLOR,
                        },
                    };
                }
            })
        );
    };
    const BFS = async () => {
        if (isVisualizing) return;
        const startNode = prompt("Enter the starting node ID for BFS");
        if (!startNode) return;

        const startNodeStr = String(startNode);
        if (!nodesMap.has(startNodeStr)) {
            alert(`Node "${startNodeStr}" not found in the graph.`);
            setTraversalOutput(`Error: Node "${startNodeStr}" not found.`);
            return;
        }

        setIsVisualizing(true);
        resetVisualization();
        await delay(100);

        const adjList = createAdjacencyList();
        const visited = new Set();
        const queue = [[startNodeStr, 0]];
        visited.add(startNodeStr);

        let currentElements = [...elements];
        let outputText = `BFS starting from Node ${startNodeStr}:\nLevel 0: ${startNodeStr}`;

        setTraversalOutput(outputText);
        const startElementIndex = currentElements.findIndex(
            (el) => el.data.id === startNodeStr
        );
        if (startElementIndex !== -1) {
            const startColor = BFS_COLORS[0 % BFS_COLORS.length];
            currentElements[startElementIndex] = {
                ...currentElements[startElementIndex],
                style: {
                    ...currentElements[startElementIndex].style,
                    "background-color": startColor,
                },
            };
            setElements([...currentElements]);
            await delay(600);
        }

        let currentLevel = 0;
        let levelNodes = [];
        while (queue.length > 0) {
            const [currentNodeId, level] = queue.shift();
            if (level > currentLevel) {
                outputText += `\nLevel ${level}: ${levelNodes.join(", ")}`;
                setTraversalOutput(outputText);
                currentLevel = level;
                levelNodes = [];
            }
            const neighbors = adjList.get(currentNodeId) || [];
            for (const neighborId of neighbors) {
                if (!visited.has(neighborId)) {
                    visited.add(neighborId);
                    const nextLevel = level + 1;
                    queue.push([neighborId, nextLevel]);
                    levelNodes.push(neighborId);
                    const neighborElementIndex = currentElements.findIndex(
                        (el) => el.data.id === neighborId
                    );
                    if (neighborElementIndex !== -1) {
                        const color = BFS_COLORS[nextLevel % BFS_COLORS.length];
                        currentElements[neighborElementIndex] = {
                            ...currentElements[neighborElementIndex],
                            style: {
                                ...currentElements[neighborElementIndex].style,
                                "background-color": color,
                            },
                        };
                        setElements([...currentElements]);
                        await delay(400);
                    }
                }
            }
            await delay(200);
        }
        if (levelNodes.length > 0) {
            outputText += `\nLevel ${currentLevel + 1}: ${levelNodes.join(
                ", "
            )}`;
        }

        outputText += "\n\nBFS Complete!";
        setTraversalOutput(outputText);
        setIsVisualizing(false);
    };
    const DFS = async () => {
        if (isVisualizing) return;
        const startNode = prompt("Enter the starting node ID for DFS");
        if (!startNode) return;

        const startNodeStr = String(startNode);
        if (!nodesMap.has(startNodeStr)) {
            alert(`Node "${startNodeStr}" not found in the graph.`);
            setTraversalOutput(`Error: Node "${startNodeStr}" not found.`);
            return;
        }

        setIsVisualizing(true);
        resetVisualization();
        await delay(100);

        const adjList = createAdjacencyList();
        const visited = new Set();
        const stack = [startNodeStr];
        let currentElements = [...elements];
        let outputText = `DFS starting from Node ${startNodeStr}:`;
        setTraversalOutput(outputText);

        while (stack.length > 0) {
            const currentNodeId = stack.pop();

            if (!visited.has(currentNodeId)) {
                visited.add(currentNodeId);
                outputText += ` -> ${currentNodeId}`;
                setTraversalOutput(outputText);
                const elementIndex = currentElements.findIndex(
                    (el) => el.data.id === currentNodeId
                );
                if (elementIndex !== -1) {
                    currentElements[elementIndex] = {
                        ...currentElements[elementIndex],
                        style: {
                            ...currentElements[elementIndex].style,
                            "background-color": VISITED_COLOR_DFS,
                        },
                    };
                    setElements([...currentElements]);
                }

                await delay(600);
                const neighbors = adjList.get(currentNodeId) || [];
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    const neighborId = neighbors[i];
                    if (!visited.has(neighborId)) {
                        stack.push(neighborId);
                    }
                }
            }
        }

        outputText += "\n\nDFS Complete!";
        setTraversalOutput(outputText);
        setIsVisualizing(false);
    };

    return (
        <div id="container">
            <h1 id="Heading-of-project">Graph Visualizer</h1>
            <div id="Input-section">
                <GraphInput edges={edges} setEdges={setEdges} />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >
                    <button
                        onClick={updateGraph}
                        className="buttons"
                        disabled={isVisualizing}
                    >
                        Visualize Graph
                    </button>
                    <button
                        className="buttons"
                        onClick={BFS}
                        disabled={isVisualizing}
                    >
                        Run BFS
                    </button>
                    <button
                        className="buttons"
                        onClick={DFS}
                        disabled={isVisualizing}
                    >
                        Run DFS
                    </button>
                    <div id="Traversal-output">
                        <h2>Traversal Output:</h2>
                        <pre>{traversalOutput}</pre>{" "}
                    </div>
                </div>
            </div>
            <div id="Graph-section">
                <GraphView elements={elements} />
            </div>
        </div>
    );
};
export default App;
