import { MouseEvent, useEffect, useRef, useState } from 'react';
import simple1 from './img/simple1.png'
import simple2 from './img/simple2.png'
import hard1 from './img/hard1.png'
import shortcut1 from './img/shortcut1.png'
import spiral1 from './img/spiral1.png'
import './App.css';
import ReactImageUploadComponent from 'react-images-upload';
import { unstable_batchedUpdates } from 'react-dom';
import { SevenSegmentDisplay } from './components/SevenSegmentDisplay';
import { useTimer } from 'use-timer';
import { Button, Col, Dropdown, DropdownButton, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

declare global {
  interface Window {
    data?: Uint8ClampedArray
  }
}

type Record = {
  levelName: string,
  playerName: string,
  time: number,
  fails: number
}

function App() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [data, setData] = useState(new Uint8ClampedArray())
  const [width, setWidth] = useState(1)
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fails, setFails] = useState(0);
  const [finishTimes, setFinishTimes] = useState(new Array<Record>());
  const { time, start, pause, reset } = useTimer({ interval: 50, step: 50 });
  const [levelName, setLevelName] = useState("Simple 1");
  const [playerName, setPlayerName] = useState("Player Name");

  const imgToPixels = () => {
    if (imgRef && imgRef.current !== null) {
      let canvas = document.createElement('canvas');
      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;
      canvas.getContext('2d')?.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
      let imgData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
      window.data = imgData;
      if (imgData) {
        setData(imgData);
      }
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
          setFinishTimes([{ time, fails, levelName, playerName }, ...finishTimes]);
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(imgToPixels, 1000)
  }, [])

  const changeLevel = (newLevel: string, levelName: string) => {
    if (imgRef && imgRef.current) {
      imgRef.current.src = newLevel;
      setLevelName(levelName);
      reset();
      setFinished(false);
      setFails(0);
    }
  }

  return (
    <div className="App" style={{ backgroundColor: "#333333" }}>

      <div style={{ fontSize: "32px", color: "white" }}>
        <Form.Group>
          <Form.Row>
            <Col>
              <Form.Control size="lg" type="text" placeholder={playerName} onChange={(x) => setPlayerName(x.currentTarget.value)} />
            </Col>
          </Form.Row>
        </Form.Group>
        Time: <SevenSegmentDisplay number={time / 10} dotPosition={2} /> &nbsp;
        Fails: <SevenSegmentDisplay number={fails} color="#ff4242" background="#420e0e" />
      </div>
      <img
        src={simple1}
        style={{ cursor: "cell", margin: "1vh" }}
        onMouseMove={(e) => mouseMove(e)}
        onMouseOut={() => { setActive(false); pause() }}
        ref={imgRef}
        onLoad={imgToPixels}
        alt="labyrinth" />
      <div>
        <b style={{ color: finished ? "lightgreen" : (active ? "blue" : "red"), fontSize: "32px" }}>
          {finished ? "Finished! Press reset for a new round." : (active ? "Active! Be careful." : "Alarm! Move to start area.")}
        </b>
        <br />
      </div>
      <br />
      <div>
        <Button variant="outline-warning" onClick={() => { reset(); setFinished(false); setFails(0) }} style={{ margin: "10px" }}>Reset</Button>
        <DropdownButton id="dropdown-basic-button" title="Select Level">
          <Dropdown.Item onClick={() => { changeLevel(simple1, "Simple 1") }}>Simple 1</Dropdown.Item>
          <Dropdown.Item onClick={() => { changeLevel(simple2, "Simple 2") }}>Simple 2</Dropdown.Item>
          <Dropdown.Item onClick={() => { changeLevel(hard1, "Hard 1") }}>Hard 1</Dropdown.Item>
          <Dropdown.Item onClick={() => { changeLevel(shortcut1, "Shortcut 1") }}>Shortcut 1</Dropdown.Item>
          <Dropdown.Item onClick={() => { changeLevel(spiral1, "Spiral 1") }}>Spiral 1</Dropdown.Item>
        </DropdownButton>
        <ReactImageUploadComponent
          withIcon={false}
          buttonText='Choose own level file'
          singleImage={true}
          label=""
          buttonClassName="btn btn-primary"
          fileContainerStyle={{ display: "inline-block", background: "transparent", padding: "0", margin: "0" }}
          onChange={(x) => {
            let fr = new FileReader();
            fr.onload = () => { if (typeof fr.result === "string") { changeLevel(fr.result, "Custom") } }
            fr.readAsDataURL(x[0]);
          }}
          maxFileSize={5242880}
        />
      </div>
      <div style={{
        color: "white"
      }}>
        <h3>Highscore</h3>
        <Table size="sm" striped={true} variant="dark" style={{ width: "50%", margin: "auto" }}>
          <thead><tr><th>Level</th><th>Player</th><th>Time</th><th>Fails</th></tr></thead>
          <tbody>
            {finishTimes.map((x, i) => (<tr key={i}><td>{x.levelName}</td><td>{x.playerName}</td><td>{x.time} ms</td><td>{x.fails}</td></tr>))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;