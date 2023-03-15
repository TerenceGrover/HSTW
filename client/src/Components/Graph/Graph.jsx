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

  useEffect(() => {
    const options = {
      root: null,

      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('graph-animation');
        }
      });
    }, options);

    const target = document.getElementById('graph-container');
    observer.observe(target);
  }, []);

  return (
    <div id="graph-container">
      <h3 id="graph-header">Previous Data</h3>
      {data ? (
        <Line
          data={data}
          width={mobile ? 250 : 1000}
          height={mobile ? 200 : 500}
        />
      ) : (
        <h3 id="graph-header" style={{ padding: '150px 0 150px 0' }}>
          No data for this country
        </h3>
      )}
    </div>
  );
}
