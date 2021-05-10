import {MouseEvent, useEffect, useRef, useState} from 'react';
import labyrinth from './img/simple1.png'
import './App.css';

function App() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [data, setData]: [Array<number>,any] = useState([])
  const [width, setWidth]: [number,any] = useState(1)
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const imgToPixels = () => {
    if(imgRef && imgRef.current !== null){
      let canvas = document.createElement('canvas');
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
      canvas.getContext('2d')?.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      let imgData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
      //@ts-ignore
      window.data = imgData;
      setData(imgData);
      setWidth(canvas.width)
    }
  }

  const getColorForCoord = (x: number, y: number) => {
    var red = y * (width * 4) + x * 4;
    return data.slice(red, red + 3);
  }

  const [START, END, FREE, WALL] = [0, 1, 2, 3]

  const getFieldType = (x: number, y: number) => {
    const colors = getColorForCoord(x,y);
    return colors[2]>0 ? FREE : (colors[1]>0 ? START : (colors[0]>0 ? END : WALL));
  }

  const mouseMove = (event: MouseEvent) => {
    let x = event.nativeEvent.offsetX
    let y = event.nativeEvent.offsetY
    //console.log(x,y)
    if(data){
      let fieldType = getFieldType(x,y)
      if(fieldType===START){
        setActive(true);
      }
      if(active){
        if(fieldType===WALL){
          setActive(false);
        }
        if(fieldType===END){
          setFinished(true);
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(imgToPixels,1000)
  }, [])

  return (
    <div className="App">
      <img src={labyrinth} style={{cursor: "cell"}} onMouseMove={mouseMove} onMouseOut={()=>setActive(false)} ref={imgRef} alt="labyrinth"/>
      <div>
        <b style={{color: active?"green":"red"}}>{active ? "" : "in"}active</b><br/>
        <b style={{color: finished?"green":"red"}}>{finished ? "" : "not "}finished</b>
      </div>
    </div>
  );
}

export default App;
