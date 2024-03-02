import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <progress className="progress w-56"></progress>
    </div>
  );
};

export default Loader;
