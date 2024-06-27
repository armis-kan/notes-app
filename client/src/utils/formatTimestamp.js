const formatTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp);
    const formattedDate = dateObj.toLocaleDateString();
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      date: formattedDate,
      time: formattedTime
    };
  };
  
  export default formatTimestamp;
  