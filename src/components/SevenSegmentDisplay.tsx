// Code derived from Brian Hayes CodePen: https://codepen.io/joeyred/pen/gEpVbM available under MIT License

import { SevenSegmentDigit } from "./SevenSegmentDigit"
import { SevenSegmentDot } from "./SevenSegmentDot";

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
    let digitComponents = digits.map(x => <SevenSegmentDigit digit={x} style={digitStyle} />);
    if (props.number >= 100) {
        digitComponents.splice(1, 0, <SevenSegmentDot style={{ ...digitStyle, maxWidth: "1.5rem", minWidth: "1.5rem", }} />)
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
    background: "#19101F"
}