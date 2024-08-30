import React, { useContext } from 'react';
import { MyContext } from './MyContext'; // Import the context

const MyComponent = () => {
  const context = useContext(MyContext);

  if (!context) {
    return <div>Error: Context is null</div>;
  }

  const { basename } = context;
  return <div>Base: {basename}</div>;
};

export default MyComponent;
