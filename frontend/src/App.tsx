import React, { useState, useCallback } from "react";

import Table from "./Table";
import { Pet } from "./types";
import { API_URL } from "./constants";

import "./App.scss";

const App: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [loadingPet, setLoadingPet] = useState(false);

  const fetchPet = useCallback(async (petId: number) => {
    setLoadingPet(true);
    const resp = await fetch(`${API_URL}/pet/${petId}`);
    const data = await resp.json();

    setSelectedPet(data);
    setLoadingPet(false);
  }, []);

  return (
    <div className="App">
      <h1>TeleVet Full Stack Project</h1>
      <main>
        <Table setSelectedPet={fetchPet} />
        {loadingPet ? (
          <div>Loading...</div>
        ) : (
          selectedPet && (
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
          )
        )}
      </main>
    </div>
  );
};

export default App;
