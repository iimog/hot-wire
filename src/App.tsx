import {Fragment, MouseEvent, useEffect, useRef, useState} from 'react';
import labyrinth from './img/simple2.png'
import './App.css';
import Timer from 'react-compound-timer';
import ReactImageUploadComponent from 'react-images-upload';

function App() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [data, setData]: [Array<number>,any] = useState([])
  const [width, setWidth]: [number,any] = useState(1)
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fails, setFails] = useState(0);
  const [finishTimes, setFinishTimes]: [Array<[number,number]>, any] = useState([]);
  
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

  const mouseMove = (event: MouseEvent, start: Function, stop: Function, getTime: any) => {
    let x = event.nativeEvent.offsetX
    let y = event.nativeEvent.offsetY
    //console.log(x,y)
    if(data){
      let fieldType = getFieldType(x,y)
      if(!finished && fieldType===START){
        start();
        setActive(true);
      }
      if(active){
        if(fieldType===WALL){
          stop()
          setActive(false);
          setFails(fails+1);
          let audio = new Audio(`${process.env.PUBLIC_URL}/sirene.wav`);
          audio.play();
        }
        if(fieldType===END){
          stop()
          setActive(false);
          setFinished(true);
          setFinishTimes([[getTime(),fails],...finishTimes]);
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(imgToPixels,1000)
  }, [])

  return (
    <div className="App">
      <Timer startImmediately={false} lastUnit="s" timeToUpdate={50}>
        
            {//@ts-ignore
            ({ start, resume, pause, stop, reset, timerState, getTime }) => (
        <Fragment>
          <div style={{fontSize: "32px"}}>
            Time: <Timer.Seconds />,
              <Timer.Milliseconds /><br/>
            Fails: {fails}
          </div>
          <img
            src={labyrinth}
            style={{cursor: "cell"}}
            onMouseMove={(e) => mouseMove(e, start, stop, getTime)}
            onMouseOut={()=>{setActive(false);stop()}}
            ref={imgRef}
            onLoad={imgToPixels}
            alt="labyrinth"/>
          <div>
            <b style={{color: active?"green":"red", fontSize: "32px"}}>{active ? "" : "in"}active</b><br/>
            <b style={{color: finished?"green":"red"}}>{finished ? "" : "not "}finished</b><br/>
          </div>
            <br />
            <div>
                <button onClick={() => {reset();setFinished(false);setFails(0)}}>Reset</button>
                <ReactImageUploadComponent
                  withIcon={true}
                  buttonText='Choose images'
                  singleImage={true}
                  onChange={(x) => {
                    let fr = new FileReader();
                    fr.onload = () => {if(imgRef && imgRef.current && typeof fr.result === "string") {imgRef.current.src =  fr.result;}}
                    fr.readAsDataURL(x[0]);
                    reset()
                  }}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                />
            </div>
            <ul>
              {finishTimes.map((x,i) => (<li key={i}>{x[0]} ms - {x[1]} fails</li>))}
            </ul>
        </Fragment>
    )}
      </Timer>
    </div>
  );
}

export default App;
