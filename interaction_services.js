// A "Big-Brain" snippet for the future AI interaction
const handleMouseMove = (e, eyeRef) => {
  const rect = eyeRef.current.getBoundingClientRect();
  const eyeCenterX = rect.left + rect.width / 2;
  const eyeCenterY = rect.top + rect.height / 2;
  
  // The logic that gives the AI "sight"
  const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
  const degree = (angle * 180) / Math.PI;
  
  // AI rotates its gaze to follow you
  eyeRef.current.style.transform = `rotate(${degree}deg)`;
};