import React from "react";

const AIModel = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI Model: Reinforcement Learning</h1>
      <p className="mt-2">
        Using reinforcement learning, our model optimizes EV charging station placement based on demand forecasts, grid constraints, and traffic data.
      </p>
      <div className="mt-4 bg-gray-200 p-4 rounded">
        <h2 className="text-lg font-bold">Key Insights</h2>
        <ul className="mt-2 list-disc pl-6">
          <li>⚡ High-density areas need more **Superchargers**.</li>
          <li>🚦 Traffic bottlenecks impact station placement.</li>
          <li>🏡 Residential areas require **Regular chargers** to complement home charging.</li>
        </ul>
      </div>
    </div>
  );
};

export default AIModel;
