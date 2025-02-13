import React from "react";

const Contact = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Contact & Collaboration</h1>
      <p className="mt-2">Interested in collaborating? Reach out to us!</p>
      <div className="mt-4">
        <p>📧 Email: example@evcharging.com</p>
        <p>🔗 LinkedIn: <a href="https://linkedin.com" className="text-blue-500">EV Charging Project</a></p>
        <p>🐙 GitHub: <a href="https://github.com" className="text-blue-500">GitHub Repository</a></p>
      </div>
    </div>
  );
};

export default Contact;
