import React, { useState, useEffect } from 'react';
import { getUserSkills } from '../services/api'; // <-- This was the line to fix
import SkillBadge from '../components/SkillBadge'; // Using your SkillBadge component

function Dashboard() {
  const [skills, setSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function runs when the component loads
    const loadSkills = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Use the imported API function
        const data = await getUserSkills('anon'); // We'll hardcode 'anon' user for now
        
        setSkills(data.skills);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []); // The empty array [] means this effect runs only once

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Skill Dashboard</h1>
      
      {loading && <p>Loading your skills...</p>}
      
      {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
      
      {skills && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Current Skills</h2>
          {Object.keys(skills).length === 0 ? (
            <p>You haven't completed any quiz questions yet. Take a quiz to start building your skills!</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {/* Loop through the skills and display them */}
              {Object.entries(skills).map(([skillName, skillData]) => (
                <SkillBadge
                  key={skillName}
                  skill={skillName}
                  score={skillData.score}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;