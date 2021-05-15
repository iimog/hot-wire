// Code derived from Brian Hayes CodePen: https://codepen.io/joeyred/pen/gEpVbM available under MIT License

import { SevenSegmentDigit } from "./SevenSegmentDigit"
import { SevenSegmentDot } from "./SevenSegmentDot";

export const SevenSegmentDisplay = (props: { number: number, color: string, background: string, dotPosition: number }) => {
    const digitStyle = {
        minWidth: "2rem",
        maxWidth: "3rem",
        fill: props.color,
        display: "inline-block",
        margin: "5px"
    }
    let digits = [props.number % 10];
    let number = Math.floor(props.number / 10);
    while (number > 0) {
        digits.unshift(number % 10)
        number = Math.floor(number / 10)
    }
    let digitComponents = digits.map((x, i) => <SevenSegmentDigit key={i} digit={x} style={digitStyle} />);
    if (props.dotPosition > 0 && digitComponents.length > props.dotPosition) {
        digitComponents.splice(digitComponents.length - props.dotPosition, 0, <SevenSegmentDot key="dot" style={{ ...digitStyle, maxWidth: "1.2rem", minWidth: "1.2rem", }} />)
    }
    return (
        <div style={{
            display: "inline-block",
            background: props.background,
            borderRadius: "15px",
            padding: "1rem",
            lineHeight: 0,
        }} >
            {digitComponents}
        </div>
    );
}

SevenSegmentDisplay.defaultProps = {
    color: "#AE75D2",
    background: "#19101F",
    dotPosition: 0
}