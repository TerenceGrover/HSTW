import { useEffect, useState } from 'react';
import { checkTodayData } from '../Util/requests';

export default function Title({ index, mobile }) {
  const [worldObj, setworldObj] = useState();
  const [todayFlag, setTodayFlag] = useState(false);

  useEffect(() => {
    if (index.world) setworldObj(assignWord(index.world.global));
    checkTodayData(setTodayFlag)

  }, [index]);

  function assignWord(idx) {
    if (idx < -2) {
      return {
        word: 'Terrible',
        color: 'rgb(200, 100, 0)',
      };
    }
    if (idx > 2) {
      return {
        word: 'Amazing',
        color: 'rgb(50, 200, 50)',
      };
    }
    if (idx <= -1) {
      return {
        word: 'Bad',
        color: 'rgb(250, 20, 20)',
      };
    }
    if (idx >= 1) {
      return {
        word: 'Good',
        color: 'rgb(20, 250, 20)',
      };
    }
    if (idx > -1 || idx < 1) {
      return {
        word: 'Pretty Average',
        color: 'rgb(200, 200, 20)',
      };
    }
  }

  return (
    <div id='title-wrapper'>
      {index && worldObj ? (
        mobile ? (
          <h2 className="master" id="mobile-title">
            The World is doing <br />
            <span
              id="keyword-title"
              style={{
                backgroundColor: worldObj.color,
              }}
            >
              {worldObj.word}
            </span>{' '}
            today.
          </h2>
        ) : (
          <h2 className="master" id="desktop-title">
            The World is doing <br />
            <span
              id="keyword-title"
              style={{
                backgroundColor: worldObj.color,
              }}
            >
              {worldObj.word}
            </span>{' '}
            today.
          </h2>
        )
      ) : (
        ''
      )}
      {!todayFlag && (
      <span className="sub-master">
        Scraper came back empty handed today. This data may be from yesterday
      </span>
    )}
    </div>
  );
}
