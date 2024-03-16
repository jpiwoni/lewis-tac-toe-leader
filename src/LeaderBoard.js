// LeaderBoard.js
import React, { useEffect, useState } from 'react';

function LeaderBoard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // This URL would be your Azure Function or any backend service endpoint
    fetch('https://your-backend-service.com/leaders')
      .then(response => response.json())
      .then(data => setLeaders(data.slice(0, 3))) // Assuming the backend sends sorted data
      .catch(error => console.error('Error fetching leader board:', error));
  }, []);

  return (
    <div className="leader-board">
      <h2>Leader Board</h2>
      <ol>
        {leaders.map((player, index) => (
          <li key={index}>{player.UserName} - Wins/Ties: {player.TotalWinsOrTies}</li>
        ))}
      </ol>
    </div>
  );
}

export default LeaderBoard;
