/*
import React, { useEffect, useState } from 'react';

function LeaderBoard({ leaders }) {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/GetLewisTacToeLeaders')
      .then(response => response.json())
      .then(data => setLeaders(data))
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  return (
    <div className="leaderboard">
      <h2>Leader Board</h2>
      <ol>
        {leaders.map((leader, index) => (
          <li key={index}>{leader.UserName} - Wins: {leader.TotalWinsOrTies}</li>
        ))}
      </ol>
    </div>
  );
}

export default LeaderBoard;
*/

import React, { useEffect, useState } from 'react';

function LeaderBoard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    const fetchLeaderboardData = () => {
        fetch('http://localhost:3001/api/GetLewisTacToeLeaders')
            .then(response => response.json())
            .then(data => {
                setLeaderboard(data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
    };

    return (
        <div className="leaderboard">
            <h2>Leader Board</h2>
            <ol>
                {leaderboard.map((leader, index) => (
                    <li key={index}>{leader.UserName} - Wins: {leader.TotalWinsOrTies}</li>
                ))}
            </ol>
        </div>
    );
}

export default LeaderBoard;

