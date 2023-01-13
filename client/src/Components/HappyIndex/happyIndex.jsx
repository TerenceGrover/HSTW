import { useEffect, useState } from 'react';
import { getDateSpecificIndividualIdx } from '../../Util/requests';
import './happyIndex.css';

export default function HappyIndex() {
  const [idx, setIdx] = useState(0);
  const [yIdx, setYIdx] = useState(0);

  function parseDate(date) {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(-2);

    return `${d}-${m}-${y}`
  }

  // Calling the API for Happiness index at initialization
  useEffect(() => {
    
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1);
    
    getDateSpecificIndividualIdx('world', parseDate(today) , setIdx)
    getDateSpecificIndividualIdx('world', parseDate(yesterday) , setYIdx)
  }, []);

  return (
    <div id="index-container">
      <span id="index">Index : {`${parseInt(idx.global * 10)} / 100`}</span>
      <span id="yesterday-comparison">Yesterday {`${parseInt(idx.global * 10)} / 100`} </span>
      <span id="month-comparison">Last Month % </span>
    </div>
  );
}
