import { useEffect, useState } from "react";

export default function Title({ index }) {

  const[wordObj, setWordObj] = useState()

  useEffect(()=>{
    if (index) setWordObj(assignWord(index.global))
  }, [index])

  function assignWord(idx) {
    if (idx < -2) {
      return {
        word : 'Terrible',
        color : 'rgb(200, 100, 0)'
    };
    }
    if (idx > 2) {
      return {
        word : 'Amazing',
        color : 'rgb(50, 200, 50)'
    };
    }
    if (idx <= -1) {
      return {
        word : 'Bad',
        color : 'rgb(250, 20, 20)'
    };
    }
    if (idx >= 1) {
      return {
        word : 'Good',
        color : 'rgb(20, 250, 20)'
    };
    }
    if (idx > -1 || idx < 1) {
      return {
        word : 'Pretty Average',
        color : 'rgb(200, 200, 20)'
    };
    }
  }

  return (
    <>
      {index && wordObj ? (
        <h2 className="master">
          The World is doing <br/><span style={{
            'backgroundColor' : wordObj.color,
            'padding' : '5px 2.5vw 5px 2.5vw',
            'borderRadius' : '10px',
            'color' : 'white'
            }}>{wordObj.word}</span> today.
        </h2>
      ) : (
        <h2 className="master">
        The World is doing Meh today.
      </h2>
      )}
    </>
  );
}
