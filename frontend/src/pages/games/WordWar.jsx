import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

// ✅ Use .env variable
const socket = io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false });

export default function WordWarGame() {
  const [stage, setStage] = useState("LOBBY"); // LOBBY | WAITING | PLAYING | OVER
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const [word, setWord] = useState("");
  const [words, setWords] = useState([]);
  const [opponentWords, setOpponentWords] = useState([]);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef(null);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!username.trim() || !roomId.trim()) return;
    socket.connect();
    socket.emit("join-room", roomId.trim().toUpperCase());
    socket.emit("send-name", {
      roomId: roomId.trim().toUpperCase(),
      name: username.trim(),
    });
    setStage("WAITING");
  };

  useEffect(() => {
    const cleanInterval = () => clearInterval(intervalRef.current);

    socket.on("waiting-opponent", () => setStage("WAITING"));
    socket.on("opponent-joined", () => {});
    socket.on("start-game", () => {
      setStage("PLAYING");
      startTimer();
    });

    socket.on("receive-word", ({ word, score }) => {
      setOpponentWords((prev) => [...prev, word]);
      setOpponentScore((prev) => prev + score);
    });

    socket.on("opponent-left", () => {
      alert("Opponent left the game.");
      setStage("OVER");
      cleanInterval();
    });

    socket.on("room-full", () => {
      alert("Room is already full. Try a different ID.");
      socket.disconnect();
      setStage("LOBBY");
    });

    return () => {
      cleanInterval();
      socket.disconnect();
      socket.off();
    };
  }, []);

  const startTimer = () => {
    setTimer(60);
    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setStage("OVER");
        }
        return prev - 1;
      });
    }, 1000);
  };

  const calcScore = (w) => w.length * 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word.trim()) return;
    const cleaned = word.trim().toLowerCase();
    if (words.includes(cleaned)) {
      setWord("");
      return;
    }
    const gained = calcScore(cleaned);
    setWords((prev) => [...prev, cleaned]);
    setScore((prev) => prev + gained);
    socket.emit("send-word", { roomId, word: cleaned, score: gained });
    setWord("");
  };

  const S = {
    page: {
      height: "100vh",
      background: "linear-gradient(120deg,#141e30,#243b55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontFamily: "Segoe UI, sans-serif",
      padding: 20,
    },
    box: {
      background: "#1e2a38",
      padding: 30,
      borderRadius: 16,
      boxShadow: "0 0 15px rgba(0,0,0,.6)",
      width: "100%",
      maxWidth: 800,
    },
    input: {
      width: "100%",
      padding: 12,
      marginTop: 10,
      borderRadius: 8,
      border: "none",
      outline: "none",
      fontSize: 16,
    },
    btn: {
      width: "100%",
      padding: 12,
      marginTop: 20,
      borderRadius: 8,
      border: "none",
      fontSize: 16,
      cursor: "pointer",
      background: "#1cb5e0",
      color: "#fff",
    },
    list: {
      background: "#1e2a38",
      padding: 10,
      borderRadius: 8,
      maxHeight: 120,
      overflowY: "auto",
      marginTop: 14,
    },
    badge: {
      background: "#1e2a38",
      padding: "6px 14px",
      borderRadius: 8,
      fontSize: 14,
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    lobby: {
      background: "rgba(0,0,0,.5)",
      padding: 30,
      borderRadius: 16,
      boxShadow: "0 0 15px rgba(0,0,0,.6)",
      width: 320,
    },
  };

  return (
    <div style={S.page}>
      <AnimatePresence mode="wait">
        {stage === "LOBBY" && (
          <motion.div
            key="lobby"
            style={S.lobby}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 style={{ textAlign: "center" }}>🧠 Word War</h2>
            <form onSubmit={handleJoin}>
              <input
                style={S.input}
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                style={S.input}
                placeholder="Room ID (e.g. 1234)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              />
              <button style={S.btn} type="submit">
                Join Room
              </button>
            </form>
          </motion.div>
        )}

        {stage === "WAITING" && (
          <motion.div
            key="waiting"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Waiting for opponent to join…</h2>
            <p>
              (Share room ID: <strong>{roomId}</strong>)
            </p>
          </motion.div>
        )}

        {stage === "PLAYING" && (
          <motion.div
            key="playing"
            style={S.box}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={S.header}>
              <div style={S.badge}>👤 {username}</div>
              <div style={S.badge}>🆔 {roomId}</div>
              <div style={S.badge}>⏱️ {timer}s</div>
            </div>
            <h3>
              Your Score: {score} | Opponent: {opponentScore}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                style={S.input}
                placeholder="Type a word…"
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </form>
            <div style={S.list}>
              <strong>Your Words:</strong>
              <ul>{words.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
            <div style={S.list}>
              <strong>Opponent Words:</strong>
              <ul>{opponentWords.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
          </motion.div>
        )}

        {stage === "OVER" && (
          <motion.div
            key="over"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1>⏱️ Time’s Up!</h1>
            <p>Your Score: {score}</p>
            <p>Opponent Score: {opponentScore}</p>
            <h2>
              {score > opponentScore
                ? "🎉 You Win!"
                : score < opponentScore
                ? "😞 You Lose!"
                : "🤝 It’s a Draw!"}
            </h2>
            <button style={S.btn} onClick={() => window.location.reload()}>
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
