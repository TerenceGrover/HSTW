import './Graph.css'
import { useEffect, useState } from "react";
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { getCountrySpecificPastData } from '../../Util/requests';

export default function Graph({clicked, mobile}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCountrySpecificPastData(clicked['Alpha-2'], 4, setData)
  }, [clicked]);
  

  return (
    <div id='graph-container'>
      <h3 id='graph-header'>Data Analysis of the previous week</h3>
      {
          data 
          ? <Line data={data} width={mobile ? 250 : 800} height={mobile ? 200 : 800} />
          : <h3 id='graph-header' style={{'padding' : '150px 0 150px 0'}}>No data for this country</h3>
      }
    </div>
  );
};