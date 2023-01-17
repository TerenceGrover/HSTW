import './Graph.css'
import { useEffect, useState, useRef } from "react";
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { getCountrySpecificPastData } from '../../Util/requests';

export default function Graph({idx, clicked, mobile}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCountrySpecificPastData(clicked['Alpha-2'], 4, setData)
  }, [clicked]);
  

  return (
    <div id='graph-container'>
      {data && <Line data={data} options={{scale:2}}  />}
    </div>
  );
};