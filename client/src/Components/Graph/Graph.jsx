import './Graph.css';
import { useEffect, useState } from 'react';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { getCountrySpecificPastData } from '../../Util/requests';

export default function Graph({ clicked, mobile }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCountrySpecificPastData(clicked['Alpha-2'], 20, setData);
  }, [clicked]);

  // Make the curve smooth
  const options = {
    responsive: true,
    redraw : true,
    elements: {
      line: {
        tension: 0.15, // set the line tension to smooth out the curve
      }
    },
    scales: {
      y: {
        grid: {
          color : 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
  };

  return (
    <div id="graph-container">
      <h3 id="graph-header">Previous Data</h3>
      {data ? (
        <Line
          data={data}
          options={options}
          width={mobile ? 325 : 1000}
          height={mobile ? 250 : 500}
        />
      ) : (
        <h3 id="graph-header" style={{ padding: '150px 0 150px 0' }}>
          No data for this country
        </h3>
      )}
    </div>
  );
}
