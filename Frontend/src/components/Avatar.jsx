import React from 'react';

// Generates a consistent color based on the name string
const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert hash to a vibrant HSL color
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 50%)`; 
};

const Avatar = ({ name, size = 50, className={} }) => {
  // Get the first uppercase letter of the name
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : '?';
  const backgroundColor = getAvatarColor(name || 'Default');

  const avatarStyle = {
    backgroundColor,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: `${size * 0.45}px`,
    fontFamily: 'Arial, sans-serif',
    userSelect: 'none'
  };

  return <div style={avatarStyle} className={className}>{firstLetter}</div>;
};

export default Avatar;
