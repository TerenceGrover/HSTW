import { useEffect, useState } from 'react';
import { getDateSpecificIndividualIdx } from '../../Util/requests';
import './happyIndex.css';

export default function HappyIndex() {
  const [idx, setIdx] = useState(0);

  // Calling the API for Happiness index at initialization
  useEffect(() => {
    const date = '12-01-23'
    getDateSpecificIndividualIdx('world', date , setIdx)
  }, []);

  return (
    <div id="index-container">
      <span id="index">Index : {(idx.global * 10)}</span>
      <span id="yesterday-comparison">Yesterday % </span>
      <span id="month-comparison">Last Month % </span>
    </div>
  );
}
