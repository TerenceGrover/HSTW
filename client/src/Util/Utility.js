export function parseDate(date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = String(date.getFullYear()).slice(-2);

  return `${d}-${m}-${y}`
}

export function generateColor(indexCode, currentState = undefined) {
  
  const col = indexCode;
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

    if (currentState === 'hover') {
      colorReturn = `rgb(${colObj.r + 50},${colObj.g + 50},${colObj.b + 50})`;
    } else if (currentState === 'click') {
      colorReturn = `rgb(${colObj.r + 100},${colObj.g + 100},${
        colObj.b + 100
      })`;
    } else {
      colorReturn = `rgb(${colObj.r},${colObj.g},${colObj.b})`;
    }

  } else {
    return 'rgb(120,120,120)';
  }

  if (col.global > 1 || col.global < -1) {
    return colorReturn;
    }
  else {
    return 'rgb(200,200,0)'
  }
}

//TOBEUSED