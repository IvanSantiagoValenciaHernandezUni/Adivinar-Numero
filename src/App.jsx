import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Importar la configuración de Firebase

const App = () => {
  // Estado para manejar los datos
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [targetNumber, setTargetNumber] = useState(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [playerData, setPlayerData] = useState(null); // Para almacenar los datos del jugador

  // Función para crear un nuevo documento en Firestore
  const savePlayerData = async (name, age, score) => {
    try {
      const docRef = await addDoc(collection(db, "players"), {
        name,
        age: parseInt(age),
        score,
        date: new Date().toLocaleString(),
      });
      console.log("Jugador agregado con ID:", docRef.id);
    } catch (e) {
      console.error("Error al agregar el documento:", e);
    }
  };

  // Función para leer los datos del jugador desde Firestore
  const getPlayerData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "players"));
      querySnapshot.forEach((doc) => {
        setPlayerData(doc.data()); // Cargar el primer jugador encontrado
      });
    } catch (e) {
      console.error("Error al obtener los datos del jugador:", e);
    }
  };

  // Si hay datos previos, los cargamos desde Firestore
  useEffect(() => {
    getPlayerData();
  }, []);

  // Iniciar el juego
  const handleStartGame = () => {
    if (!name || !age) {
      alert("Por favor, ingresa tu nombre y edad.");
      return;
    }

    // Guardar datos en Firestore
    savePlayerData(name, age, 0);

    setTargetNumber(Math.floor(Math.random() * 100) + 1);
    setGuess("");
    setMessage("");
    setAttempts(0);
    setIsGameStarted(true);
  };

  // Realizar un intento para adivinar el número
  const handleGuess = () => {
    const userGuess = parseInt(guess);
    setAttempts(attempts + 1);
    if (userGuess === targetNumber) {
      setMessage(`¡Felicidades, ${name}! Adivinaste el número en ${attempts + 1} intentos.`);
      
      // Actualizar el puntaje en Firestore
      const playerRef = doc(db, "players", playerData.id); // Asumimos que solo hay un jugador
      updateDoc(playerRef, { score: attempts + 1 });
    } else if (userGuess < targetNumber) {
      setMessage("¡El número es mayor! Intenta de nuevo.");
    } else {
      setMessage("¡El número es menor! Intenta de nuevo.");
    }
  };

  // Reiniciar el juego
  const handleResetGame = () => {
    setIsGameStarted(false);
    setName("");
    setAge("");
    setGuess("");
    setMessage("");
    setAttempts(0);
  };

  return (
    <div className="App">
      <h1>Juego de Adivinar el Número</h1>

      {!isGameStarted ? (
        <div>
          <h2>Bienvenido al juego, por favor ingresa tu nombre y edad:</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <button onClick={handleStartGame}>Comenzar Juego</button>
        </div>
      ) : (
        <div>
          <h2>Adivina el número entre 1 y 100!!!</h2>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Adivina el número"
          />
          <button onClick={handleGuess}>Adivinar</button>
          <p>{message}</p>
          <p>Intentos: {attempts}</p>
          <button onClick={handleResetGame}>Reiniciar Juego</button>
        </div>
      )}
    </div>
  );
};

export default App;
