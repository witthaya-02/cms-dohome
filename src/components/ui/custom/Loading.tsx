import React from 'react';

const Loading = () => {
  return (
    <div className="flex space-x-1">
      <span className="bg-orange-500 w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="bg-orange-500 w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="bg-orange-500 w-2 h-2 rounded-full animate-bounce"></span>
    </div>
  );
};

export default Loading;
