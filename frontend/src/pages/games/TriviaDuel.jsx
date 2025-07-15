// Final MultiplayerTriviaDuel.jsx with win/loss tracking and full game sync
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const questionBank = {
  general: {
    easy: [
      {
        question: "What color is the sky?",
        options: ["Blue", "Green", "Red", "Yellow"],
        answer: "Blue",
      },
      {
        question: "Which day comes after Monday?",
        options: ["Sunday", "Tuesday", "Friday", "Wednesday"],
        answer: "Tuesday",
      },
    ],
    medium: [
      {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
        answer: "Carbon Dioxide",
      },
      {
        question: "What is the capital of Canada?",
        options: ["Toronto", "Ottawa", "Montreal", "Vancouver"],
        answer: "Ottawa",
      },
    ],
    hard: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Gd", "Go"],
        answer: "Au",
      },
      {
        question: "Who painted the Mona Lisa?",
        options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
        answer: "Da Vinci",
      },
    ],
  },
  geography: {
    easy: [
      {
        question: "Which continent is India in?",
        options: ["Africa", "Asia", "Europe", "Australia"],
        answer: "Asia",
      },
      {
        question: "Which ocean is the largest?",
        options: ["Atlantic", "Pacific", "Indian", "Arctic"],
        answer: "Pacific",
      },
    ],
    medium: [
      {
        question: "Which country has the city 'Oslo'?",
        options: ["Sweden", "Denmark", "Norway", "Finland"],
        answer: "Norway",
      },
      {
        question: "Mount Everest lies on the border of which two countries?",
        options: ["India & China", "Nepal & China", "Nepal & India", "China & Bhutan"],
        answer: "Nepal & China",
      },
    ],
    hard: [
      {
        question: "What is the capital of Kazakhstan?",
        options: ["Almaty", "Astana", "Tashkent", "Baku"],
        answer: "Astana",
      },
    ],
  },
};

export default function MultiplayerTriviaDuel() {
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("general");
  const [questions, setQuestions] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [joined, setJoined] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [score, setScore] = useState(0);
  const [playerRole, setPlayerRole] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    setQuestions([...questionBank[category][difficulty]]);
  }, [category, difficulty]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleJoin = () => {
    if (roomId.trim() && name.trim()) {
      socket.emit("join-room", roomId);
      socket.emit("send-name", { roomId, name });
      setJoined(true);
    }
  };

  useEffect(() => {
    socket.on("player-role", (role) => setPlayerRole(role));
    socket.on("opponent-joined", () => setOpponentJoined(true));
    socket.on("receive-name", (name) => {
      setOpponentName(name);
      setOpponentJoined(true);
    });
    socket.on("receive-answer", () => {
      // optionally store opponent answer here
    });
    socket.on("next-question", (allAnswers) => {
      const myAnswer = allAnswers[socket.id];
      if (myAnswer === currentQuestion.answer) setScore((prev) => prev + 1);

      setSelected(null);
      setWaitingForOpponent(false);

      setCurrentQuestionIndex((prev) => {
        const next = prev + 1;
        if (next >= questions.length) {
          setGameOver(true);
          if (score >= questions.length / 2) {
            setWins((w) => w + 1);
          } else {
            setLosses((l) => l + 1);
          }
        }
        return next;
      });
    });
    socket.on("opponent-left", () => setOpponentLeft(true));

    return () => {
      socket.off("player-role");
      socket.off("opponent-joined");
      socket.off("receive-name");
      socket.off("receive-answer");
      socket.off("next-question");
      socket.off("opponent-left");
    };
  }, [questions, score, currentQuestion]);

  const handleOptionClick = (option) => {
    if (!selected) {
      setSelected(option);
      setWaitingForOpponent(true);
      socket.emit("submit-answer", { roomId, answer: option });
    }
  };

  const restartGame = () => {
    setCurrentQuestionIndex(0);
    setSelected(null);
    setWaitingForOpponent(false);
    setGameOver(false);
    setOpponentLeft(false);
    setScore(0);
    setQuestions([...questionBank[category][difficulty]]);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #090979, #00d4ff)",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "sans-serif",
    },
    card: {
      background: "#111",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 20px cyan",
      maxWidth: "500px",
      width: "100%",
      textAlign: "center",
    },
    option: (opt) => ({
      background:
        selected === opt
          ? opt === currentQuestion.answer
            ? "#0f0"
            : "#f00"
          : "#333",
      padding: "12px",
      margin: "8px 0",
      borderRadius: "8px",
      cursor: selected ? "not-allowed" : "pointer",
      transition: "0.3s",
      border: "1px solid #0ff",
    }),
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      background: "cyan",
      color: "black",
      fontWeight: "bold",
      border: "none",
      marginTop: "10px",
    },
    select: {
      margin: "5px",
      padding: "6px",
    },
    input: {
      padding: "6px",
      margin: "5px",
    },
  };

  if (!joined) {
    return (
      <div style={styles.container}>
        <h2>Trivia Duel</h2>
        <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="geography">Geography</option>
        </select>
        <select style={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input style={styles.input} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={styles.input} placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button style={styles.button} onClick={handleJoin}>Join Room</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div style={styles.container}>
        <h2>Game Over</h2>
        <p>Your Score: {score}</p>
        <p>Wins: {wins} | Losses: {losses}</p>
        <button style={styles.button} onClick={restartGame}>Restart</button>
      </div>
    );
  }

  if (opponentLeft) {
    return (
      <div style={styles.container}>
        <h2>Opponent Left</h2>
        <button style={styles.button} onClick={restartGame}>Restart</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3>
          Q{currentQuestionIndex + 1}: {currentQuestion.question}
        </h3>
        {currentQuestion.options.map((opt, idx) => (
          <div key={idx} style={styles.option(opt)} onClick={() => handleOptionClick(opt)}>
            {opt}
          </div>
        ))}
        {waitingForOpponent && <p style={{ color: "yellow" }}>Waiting for opponent...</p>}
        <p style={{ marginTop: "10px" }}>Score: {score}</p>
        <p>Wins: {wins} | Losses: {losses}</p>
      </div>
    </div>
  );
}
