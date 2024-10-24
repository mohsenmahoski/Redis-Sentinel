"use client"

import React, { useState } from 'react';

const ChildComponent = ({ data } : { data: { name: string } }) => {
  console.log('ChildComponent rendered');
  return (<div>{data.name}</div>);
};

const ChildComponentMemo = React.memo(ChildComponent);

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [data, setData] = useState({ name: 'John' });

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={incrementCount}>Increment Count</button>
      <h1>{count}</h1>
      <ChildComponentMemo data={data} />
    </div>
  );
};

export default ParentComponent;