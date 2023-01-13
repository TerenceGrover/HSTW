import { useEffect, useState } from 'react';
import { getIdx } from '../../Util/requests';
import './happyIndex.css';

export default function MapChart() {
  const [idx, setIdx] = useState(0);

  // Calling the API for Happiness index at initialization
  useEffect(() => {
    // getIdx(setIdx)
  }, []);

  return (
    <div id="index-container">
      <span id="index">Index : {idx}</span>
      <span id="yesterday-comparison">Yesterday % </span>
      <span id="month-comparison">Last Month % </span>
    </div>
  );
}
