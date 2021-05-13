// Code derived from Brian Hayes CodePen: https://codepen.io/joeyred/pen/gEpVbM available under MIT License

import { SevenSegmentDigit } from "./SevenSegmentDigit"

export const SevenSegmentDisplay = (props: { number: number, color: string, background: string }) => {
    const digitStyle = {
        minWidth: "2rem",
        maxWidth: "4rem",
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
    return (
        <div style={{
            display: "inline-block",
            background: props.background,
            borderRadius: "15px",
            padding: "1rem",
            lineHeight: 0,
        }} >
            {digits.map(x => <SevenSegmentDigit digit={x} style={digitStyle} />)}
        </div>
    );
}

SevenSegmentDisplay.defaultProps = {
    color: "#AE75D2",
    background: "#19101F"
}