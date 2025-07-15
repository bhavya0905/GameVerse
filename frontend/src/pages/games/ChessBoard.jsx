import { useState } from "react";

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

const getColor = (piece) => {
  if (!piece) return null;
  const code = piece.charCodeAt(0);
  if (code >= 9812 && code <= 9817) return "white";
  if (code >= 9818 && code <= 9823) return "black";
  return null;
};

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("white");

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn("white");
    setSelected(null);
  };

  const isValidMove = (from, to, piece) => {
    const [fr, fc] = from;
    const [tr, tc] = to;
    const target = board[tr][tc];
    const pieceType = piece.toLowerCase();
    const color = getColor(piece);

    if (target && getColor(target) === color) return false;

    // Pawn
    if (pieceType === "♙" || pieceType === "♟") {
      const dir = color === "white" ? -1 : 1;
      const startRow = color === "white" ? 6 : 1;

      if (fc === tc && board[tr][tc] === "" && tr === fr + dir) return true;

      if (
        fc === tc &&
        fr === startRow &&
        tr === fr + 2 * dir &&
        board[fr + dir][fc] === "" &&
        board[tr][tc] === ""
      )
        return true;

      if (
        Math.abs(tc - fc) === 1 &&
        tr === fr + dir &&
        target &&
        getColor(target) !== color
      )
        return true;

      return false;
    }

    // Rook
    if (pieceType === "♖" || pieceType === "♜") {
      if (fr === tr) {
        const step = fc < tc ? 1 : -1;
        for (let c = fc + step; c !== tc; c += step)
          if (board[fr][c] !== "") return false;
        return true;
      }
      if (fc === tc) {
        const step = fr < tr ? 1 : -1;
        for (let r = fr + step; r !== tr; r += step)
          if (board[r][fc] !== "") return false;
        return true;
      }
      return false;
    }

    // Knight
    if (pieceType === "♘" || pieceType === "♞") {
      const dr = Math.abs(fr - tr);
      const dc = Math.abs(fc - tc);
      return (dr === 2 && dc === 1) || (dr === 1 && dc === 2);
    }

    return false;
  };

  const handleClick = (row, col) => {
    const clickedPiece = board[row][col];

    if (selected) {
      const { row: sr, col: sc } = selected;
      const piece = board[sr][sc];

      if (isValidMove([sr, sc], [row, col], piece)) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = piece;
        newBoard[sr][sc] = "";
        setBoard(newBoard);
        setTurn(turn === "white" ? "black" : "white");
      }

      setSelected(null);
    } else if (clickedPiece && getColor(clickedPiece) === turn) {
      setSelected({ row, col });
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#111",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
        ♟️ Chess — Turn: {turn}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 64px)",
          gridTemplateRows: "repeat(8, 64px)",
          border: "4px solid white",
          backgroundColor: "#333",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isBlack = (rowIndex + colIndex) % 2 === 1;
            const isSelected =
              selected?.row === rowIndex && selected?.col === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: isSelected
                    ? "#ffd700"
                    : isBlack
                    ? "#b58863"
                    : "#f0d9b5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 40,
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    color: getColor(cell) === "white" ? "#fff" : "#000",
                  }}
                >
                  {cell}
                </span>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={resetGame}
        style={{
          marginTop: "1.5rem",
          padding: "0.5rem 1.5rem",
          backgroundColor: "#e53935",
          color: "white",
          border: "none",
          fontSize: "1rem",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🔁 Reset Game
      </button>
    </div>
  );
}
