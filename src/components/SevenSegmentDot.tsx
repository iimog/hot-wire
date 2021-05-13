// Code derived from Brian Hayes CodePen: https://codepen.io/joeyred/pen/gEpVbM available under MIT License

import { CSSProperties } from "react";

export const SevenSegmentDot = (props: { style: CSSProperties }) => {
    const dot = <polygon id='dot' points='4.8,89.7 9.8,92.7 14.8,89.7 9.8,86.6' />
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 19.6 92.7' preserveAspectRatio='xMidYMid meet' style={props.style}>
            {dot}
        </svg>
    );
}