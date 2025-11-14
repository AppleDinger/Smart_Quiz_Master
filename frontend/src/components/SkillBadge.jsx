import React from 'react';

/**
 * A component to display a user's skill and score.
 */
function SkillBadge({ skill, score }) {
  // Clamps score between 0 and 1 for the progress bar
  const progress = Math.max(0, Math.min(1, score || 0));
  
  // Pick a color based on the score
  let barColor = 'bg-red-500';
  if (progress > 0.7) {
    barColor = 'bg-green-500';
  } else if (progress > 0.4) {
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="w-64 p-4 bg-white rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        {/* Capitalize the skill name */}
        <span className="font-semibold capitalize">{skill}</span>
        <span className="text-sm font-bold text-gray-600">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${barColor}`} 
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

export default SkillBadge;