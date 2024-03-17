import React, { useEffect, useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </div>
  );
}

function LeaderBoard({ leaderBoard }) {
  return (
    <div className="leaderboard">
      <h2>LeaderBoard</h2>
      <ol>
        {leaderBoard.map((player, index) => (
          <li key={index}>
            {player.userName} - Wins or Ties: {player.totalWinsOrTies}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const moves = history.map((_, move) => {
    const description = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const [leaderBoard, setLeaderBoard] = useState([]);

  useEffect(() => {
    // Replace 'your-backend-url' with the actual backend server URL
    fetch('your-backend-url/api/GetLewisTacToeLeaders')
      .then(response => response.json())
      .then(data => {
        setLeaderBoard(data.slice(0, 3)); // Assuming you want the top 3 players
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);  

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleWinOrTie() {
    // Assuming sessionStorage has 'authenticated' set after successful GitHub login
    if (!sessionStorage.getItem('authenticated')) {
      window.location.href = 'http://localhost:3001/auth/github/callback';
    } else {
      fetch('http:localhost:3001/api/AddWinOrTie', {
        method: 'POST',
        credentials: 'include', // Needed to include session cookie in request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: sessionStorage.getItem('authenticated'), winOrTie: 'win' }), // Pass the relevant data
      })
      .then(response => response.json())
      .then(data => {
        // Handle success, update leaderboard if necessary
        if (data.success) {
          // Refresh leaderboard or add logic to update state with new win/tie
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }  

  const winner = calculateWinner(currentSquares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <div className="status">{status}</div>
      </div>
      <div className="game-info">
        <div>{moves}</div>
      </div>
      <LeaderBoard leaderBoard={leaderBoard} />
      <button onClick={handleWinOrTie}>I Just Won (or Tied)</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
