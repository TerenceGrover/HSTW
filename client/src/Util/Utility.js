export function parseDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear()).slice(-2);

  return `${d}-${m}-${y}`
}

export function generateColor(col, tansparency = 1 , currentState = undefined) {
  
  let colorReturn;

  if (col) {

    const colObj = {
      r:
        col.global < 0
          ? Math.abs(col.global) * 50 + 25 + col.N
          : 1 / Math.abs(col.global),
      g:
        col.global > 0
          ? Math.abs(col.global) * 50 + 25 + col.P
          : 1 / Math.abs(col.global),
      b: Math.abs(col.M * 255 - col.Nu * 255) / 10,
    };

    if (col.global < 1 && col.global > -1) {
      colObj.r = 200
      colObj.g = 200
      colObj.b = 0
      colorReturn = `rgba(200,200,0, ${tansparency})`
    }
    
    if (currentState === 'hover') {
      Object.keys(colObj).forEach(rgb => colObj[rgb] += 50)
      colorReturn = `rgba(${colObj.r},${colObj.g + 50},${colObj.b + 50}, ${tansparency})`;
    
    } else if (currentState === 'click') {
      Object.keys(colObj).forEach(rgb => colObj[rgb] += 100)
    }
    
    colorReturn = `rgba(${colObj.r},${colObj.g},${colObj.b}, ${tansparency})`;

  } else {
      if (currentState === 'hover') {
        colorReturn = `rgba(170,170,170, ${tansparency})`;
      } else if (currentState === 'click') {
        colorReturn = `rgba(220,220,220, ${tansparency})`;
      } else {
        colorReturn = `rgba(120,120,120, ${tansparency})`;
      }
  }
  
  return colorReturn
}

//TOBEUSED