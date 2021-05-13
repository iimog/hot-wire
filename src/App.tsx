import { Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import labyrinth from './img/simple2.png'
import './App.css';
import ReactImageUploadComponent from 'react-images-upload';
import { unstable_batchedUpdates } from 'react-dom';
import { SevenSegmentDisplay } from './components/SevenSegmentDisplay';
import { useTimer } from 'use-timer';

declare global {
  interface Window {
    data?: Uint8ClampedArray
  }
}


function App() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [data, setData]: [Array<number>, any] = useState([])
  const [width, setWidth]: [number, any] = useState(1)
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fails, setFails] = useState(0);
  const [finishTimes, setFinishTimes]: [Array<[number, number]>, any] = useState([]);
  const { time, start, pause, reset } = useTimer({ interval: 50, step: 50 });

  const imgToPixels = () => {
    if (imgRef && imgRef.current !== null) {
      let canvas = document.createElement('canvas');
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
      canvas.getContext('2d')?.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      let imgData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
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
    const colors = getColorForCoord(x, y);
    return colors[2] > 0 ? FREE : (colors[1] > 0 ? START : (colors[0] > 0 ? END : WALL));
  }

  const mouseMove = (event: MouseEvent) => {
    let x = event.nativeEvent.offsetX
    let y = event.nativeEvent.offsetY
    if (data) {
      let fieldType = getFieldType(x, y)
      if (!finished && fieldType === START) {
        start();
        setActive(true);
      }
      if (active) {
        if (fieldType === WALL) {
          pause()
          //TODO https://www.npmjs.com/package/use-local-slice
          unstable_batchedUpdates(() => {
            setActive(false);
            setFails(fails + 1);
          })
          let audio = new Audio(`${process.env.PUBLIC_URL}/sirene.wav`);
          audio.play();
        }
        if (fieldType === END) {
          pause()
          setActive(false);
          setFinished(true);
          setFinishTimes([[time, fails], ...finishTimes]);
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(imgToPixels, 1000)
  }, [])


  return (
    <div className="App" style={{ backgroundColor: "#333333" }}>

      <div style={{ fontSize: "32px", color: "white" }}>
        Time: <SevenSegmentDisplay number={time / 10} /> &nbsp;
        Fails: <SevenSegmentDisplay number={fails} color="#ff4242" background="#420e0e" />
      </div>
      <img
        src={labyrinth}
        style={{ cursor: "cell", margin: "1vh" }}
        onMouseMove={(e) => mouseMove(e)}
        onMouseOut={() => { setActive(false); pause() }}
        ref={imgRef}
        onLoad={imgToPixels}
        alt="labyrinth" />
      <div>
        <b style={{ color: finished ? "green" : (active ? "blue" : "red"), fontSize: "32px" }}>
          {finished ? "Finished! Press reset for a new round." : (active ? "Active! Be careful." : "Alarm! Move to start area.")}
        </b>
        <br />
      </div>
      <br />
      <div>
        <button onClick={() => { reset(); setFinished(false); setFails(0) }}>Reset</button>
        <ReactImageUploadComponent
          withIcon={true}
          buttonText='Choose level file'
          singleImage={true}
          onChange={(x) => {
            let fr = new FileReader();
            fr.onload = () => { if (imgRef && imgRef.current && typeof fr.result === "string") { imgRef.current.src = fr.result; } }
            fr.readAsDataURL(x[0]);
            reset(); setFinished(false); setFails(0)
          }}
          imgExtension={['.jpg', '.gif', '.png', '.gif']}
          maxFileSize={5242880}
        />
      </div>
      <ul>
        {finishTimes.map((x, i) => (<li key={i}>{x[0]} ms - {x[1]} fails</li>))}
      </ul>
    </div>
  );
}

export default App;