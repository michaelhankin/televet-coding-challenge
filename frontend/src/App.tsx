import React, { useState } from "react";

import Table from "./Table";
import { Pet } from "./types";

const App: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="App">
      <h1>TeleVet Full Stack Project</h1>
      <Table setSelectedPet={setSelectedPet} />
      {selectedPet && (
        <div>
          <span>ID: {selectedPet.id}</span>
          <br />
          <span>Name: {selectedPet.name}</span>
          <br />
          <span>Weight: {selectedPet.weight}</span>
          <br />
          <span>Age: {selectedPet.age}</span>
          <br />
          <button
            onClick={() => {
              setSelectedPet(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
