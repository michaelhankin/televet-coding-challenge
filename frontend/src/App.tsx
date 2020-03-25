import React, { useEffect, useState } from "react";
import "./App.css";

type Pet = {
  id: number;
  name: string;
  age: string;
  weight: string;
};

type GetPetsResponse = {
  pets: Pet[];
};

const App: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  const fetchPets = async () => {
    const resp = await fetch("http://localhost:8000/pets");
    const respJson: GetPetsResponse = await resp.json();
    const pets = respJson.pets;

    setPets(pets);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="App">
      {pets.length ? (
        <ol>
          {pets.map(pet => (
            <li key={pet.id}>{pet.name}</li>
          ))}
        </ol>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default App;
