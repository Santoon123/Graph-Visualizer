import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

const GraphView = ({ elements }) => {
  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: '1300px', height: '600px' }}
      layout={{ name: 'grid' }}
    />
  );
};

export default GraphView;
