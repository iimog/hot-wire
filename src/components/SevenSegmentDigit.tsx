// Code derived from Brian Hayes CodePen: https://codepen.io/joeyred/pen/gEpVbM available under MIT License

import { CSSProperties } from "react";

const charToSSD = (digit: number) => {
    const segmentArrays = [
        [true, true, true, false, true, true, true],
        [false, false, false, false, false, true, true],
        [false, true, true, true, true, true, false],
        [false, false, true, true, true, true, true],
        [true, false, false, true, false, true, true],
        [true, false, true, true, true, false, true],
        [true, true, true, true, true, false, true],
        [false, false, true, false, false, true, true],
        [true, true, true, true, true, true, true],
        [true, false, true, true, true, true, true],
    ];
    return segmentArrays[digit];
}

export const SevenSegmentDigit = (props: { digit: number, style: CSSProperties }) => {
    const displayStates = charToSSD(props.digit);
    const segments = [
        displayStates[0] ?
            <polygon
                key='v_top-left'
                points='3,4.6 0,9.6 0,39.4 3,44.4 6.1,39.4 6.1,9.6'
            /> : null,
        displayStates[1] ?
            <polygon
                key='v_bottom-left'
                points='3,48.1 0,53.1 0,82.8 3,87.8 6.1,82.8 6.1,53.1'
            /> : null,
        displayStates[2] ?
            <polygon
                key='h_top'
                points='4.8,3 9.8,6.1 39.5,6.1 44.5,3 39.5,0 9.8,0'
            /> : null,
        displayStates[3] ?
            <polygon
                key='h_middle'
                points='4.8,46.2 9.8,49.3 39.5,49.3 44.5,46.2 39.5,43.2 9.8,43.2'
            /> : null,
        displayStates[4] ?
            <polygon
                key='h_bottom'
                points='4.8,89.7 9.8,92.7 39.5,92.7 44.5,89.7 39.5,86.6 9.8,86.6'
            /> : null,
        displayStates[5] ?
            <polygon
                key='v_top-right'
                points='46.3,4.6 49.3,9.6 49.3,39.4 46.3,44.4 43.2,39.4 43.2,9.6'
            /> : null,
        displayStates[6] ?
            <polygon
                key='v_bottom-right'
                points='46.3,48.1 49.3,53.1 49.3,82.8 46.3,87.8 43.2,82.8 43.2,53.1'
            /> : null
    ];
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 49.3 92.7' preserveAspectRatio='xMidYMid meet' style={props.style}>
            {segments}
        </svg>
    );
}