import React from "react";

const GraphInput = ({ edges, setEdges }) => {
    const handleChange = (e) => {
        setEdges(e.target.value);
    };

    return (
        <textarea
            rows="8"
            value={edges}
            onChange={handleChange}
            placeholder="Enter edges as JSON array: e.g., [[1, 2], [2, 3], [1, 4]]"
            aria-label="Graph Edge Input"
        />
    );
};

export default GraphInput;
