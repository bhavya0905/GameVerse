import React, { useState } from 'react';

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);

  const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const checkWinner = (newBoard) => {
    for (let [a, b, c] of winLines) {
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    if (newBoard.every(cell => cell)) return 'draw';
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    const result = checkWinner(newBoard);
    setBoard(newBoard);
    if (result) setWinner(result);
    else setTurn(turn === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setTurn('X');
  };

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Tic Tac Toe</h1>
      <h2 style={styles.status}>
        {winner === 'draw' ? '🤝 It\'s a draw!' :
         winner ? `🎉 ${winner} wins!` :
         `Turn: ${turn}`}
      </h2>

      <div style={styles.grid}>
        {board.map((val, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={styles.cell}
          >
            {val}
          </div>
        ))}
      </div>

      <button style={styles.button} onClick={resetGame}>🔄 Restart</button>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#1e272e',
    color: '#f5f6fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '10px',
  },
  status: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 100px)',
    gap: '10px',
    marginBottom: '20px',
  },
  cell: {
    width: '100px',
    height: '100px',
    background: '#2f3640',
    border: '2px solid #dcdde1',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00cec9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    background: '#00cec9',
    color: '#2d3436',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
