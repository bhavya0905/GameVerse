// Updated MultiplayerSpaceRace.jsx with Score, Timer, Steps, Finish Line Styling, Restart Button

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function MultiplayerSpaceRace() {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [joined, setJoined] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [playerRole, setPlayerRole] = useState('');

  const [myPosition, setMyPosition] = useState(60);
  const [opponentPosition, setOpponentPosition] = useState(60);
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const [countdown, setCountdown] = useState(null);
  const [started, setStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const gameWidth = 200;
  const finishLine = gameWidth - 40;

  useEffect(() => {
    socket.on('player-role', (role) => setPlayerRole(role));
    socket.on('opponent-joined', () => setOpponentJoined(true));
    socket.on('opponent-move', (pos) => setOpponentPosition(pos));
    socket.on('opponent-left', () => {
      setOpponentJoined(false);
      resetGame();
    });
    socket.on('receive-name', (opName) => setOpponentName(opName));

    return () => {
      socket.off('player-role');
      socket.off('opponent-joined');
      socket.off('opponent-move');
      socket.off('opponent-left');
      socket.off('receive-name');
    };
  }, []);

  useEffect(() => {
    if (joined && opponentJoined && !started) {
      let count = 3;
      setCountdown(count);
      const interval = setInterval(() => {
        count--;
        if (count === 0) {
          clearInterval(interval);
          setCountdown(null);
          setStarted(true);
          setTimerRunning(true);
          const id = setInterval(() => setTime(t => t + 1), 1000);
          setIntervalId(id);
        } else {
          setCountdown(count);
        }
      }, 1000);
    }
  }, [joined, opponentJoined]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!joined || !opponentJoined || !started || winner) return;
      if ([" ", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

      if (e.key === "ArrowLeft" || e.key === "a") {
        setMyPosition((prev) => {
          const newPos = Math.max(0, prev - 10);
          socket.emit("player-move", { roomId, position: newPos });
          setSteps(s => s + 1);
          return newPos;
        });
      }

      if (e.key === "ArrowRight" || e.key === "d") {
        setMyPosition((prev) => {
          const newPos = Math.min(finishLine, prev + 10);
          socket.emit("player-move", { roomId, position: newPos });
          setSteps(s => s + 1);
          return newPos;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [roomId, joined, opponentJoined, started, winner]);

  useEffect(() => {
    if (myPosition >= finishLine && !winner) {
      setWinner(name);
      clearInterval(intervalId);
      setTimerRunning(false);
    }
    if (opponentPosition >= finishLine && !winner) {
      setWinner(opponentName);
      clearInterval(intervalId);
      setTimerRunning(false);
    }
  }, [myPosition, opponentPosition]);

  const handleJoin = () => {
    if (roomId.trim() && name.trim()) {
      socket.emit('join-room', roomId);
      socket.emit('send-name', { roomId, name });
      setJoined(true);
    }
  };

  const resetGame = () => {
    setMyPosition(60);
    setOpponentPosition(60);
    setWinner(null);
    setSteps(0);
    setTime(0);
    setStarted(false);
    setTimerRunning(false);
    clearInterval(intervalId);
  };

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      background: 'radial-gradient(#000010, #000000)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'monospace',
      color: '#0ff',
    },
    gameArea: {
      width: `${gameWidth}px`,
      height: '300px',
      background: '#222',
      border: '2px solid #0ff',
      position: 'relative',
      marginTop: '20px',
    },
    ship: (x, y) => ({
      width: '40px',
      height: '40px',
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transition: 'left 0.1s',
    }),
    nameTag: (x, y) => ({
      position: 'absolute',
      left: `${x}px`,
      top: `${y - 20}px`,
      color: '#fff',
      fontSize: '12px',
    }),
    finishLine: {
      width: '6px',
      height: '100%',
      background: 'repeating-linear-gradient(45deg, #f00, #f00 5px, #fff 5px, #fff 10px)',
      position: 'absolute',
      left: `${finishLine}px`,
      top: 0,
    },
    stats: {
      marginTop: '10px',
      fontSize: '14px',
    },
    button: {
      marginTop: '12px',
      padding: '8px 16px',
      background: '#0ff',
      color: '#000',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  if (!joined) {
    return (
      <div style={styles.container}>
        <h2>🚀 Join Space Race</h2>
        <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={handleJoin}>Join Room</button>
      </div>
    );
  }

  if (!opponentJoined) {
    return (
      <div style={styles.container}>
        <h2>Waiting for opponent in room "{roomId}"...</h2>
      </div>
    );
  }

  if (countdown !== null) {
    return (
      <div style={styles.container}>
        <h2>Starting in... {countdown}</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>🚀 Space Race</h2>
      <div style={styles.stats}>Time: {time}s | Steps: {steps}</div>
      {winner && <h3>🏁 Winner: {winner}</h3>}
      <div style={styles.gameArea}>
        <div style={styles.finishLine}></div>
        <img src="https://cdn-icons-png.flaticon.com/512/3211/3211699.png" alt="You" style={styles.ship(myPosition, playerRole === "player1" ? 250 : 20)} />
        <div style={styles.nameTag(myPosition, playerRole === "player1" ? 250 : 20)}>{name}</div>
        <img src="https://cdn-icons-png.flaticon.com/512/3211/3211710.png" alt="Opponent" style={styles.ship(opponentPosition, playerRole === "player1" ? 20 : 250)} />
        <div style={styles.nameTag(opponentPosition, playerRole === "player1" ? 20 : 250)}>{opponentName}</div>
      </div>
      {winner && <button style={styles.button} onClick={resetGame}>Restart</button>}
    </div>
  );
}
