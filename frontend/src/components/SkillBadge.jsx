import React from 'react';

export default function SkillBadge({ label }) {
  return <span className="skill" title={label}>{label}</span>;
}
