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
      {mobile 
      ?
      data && <Line data={data} width={250} height={200} />
      :
      data && <Line data={data} width={800} height={400} />
      }
    </div>
  );
};