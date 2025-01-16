import React from 'react';

const GraphInput = ({ edges, setEdges }) => {
  const handleChange = (e) => {
    setEdges(e.target.value);
  };

  return (
    <div>
      <textarea
        rows="5"
        value={edges}
        onChange={handleChange}
        placeholder="Enter edges as [[a, b], [b, c]]"
        style={{ width: '150px', height: '600px' }}
      />
    </div>
  );
};

export default GraphInput;
