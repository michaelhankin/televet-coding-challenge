import React, { useState } from "react";

import Table from "./Table";
import { Pet } from "./types";

import "./App.scss";

const App: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  return (
    <div className="App">
      <h1>TeleVet Full Stack Project</h1>
      <main>
        <Table setSelectedPet={setSelectedPet} />
        {selectedPet && (
          <div className="selected-pet">
            <span>ID: {selectedPet.id}</span>
            <span>Name: {selectedPet.name}</span>
            <span>Weight: {selectedPet.weight}</span>
            <span>Age: {selectedPet.age}</span>
            <button
              onClick={() => {
                setSelectedPet(null);
              }}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
