import React, { useCallback, useRef, useState } from "react";
import { produce } from "immer";

const numRows = 50;
const numCols = 50;

function App() {
    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => 0));
        }
        return rows;
    });
    const [running, setRunning] = useState(false);

    // by using the useCallBack, we ensure that this function is only being run once.
    // we are trying to access 'running' within this function, which is a problem because
    // the running state changes repeatedly, so the runSimulation function would not stay uptodate.
    // to combat this issue, we will store it in a REF
    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }
        // simulate
        setTimeout(runSimulation, 1000);
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running);
                }}
            >
                {running ? "stop" : "start"}
            </button>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
                {grid.map((rows, i) =>
                    rows.map((col, j) => (
                        <div
                            key={`${i}-${j}`}
                            onClick={() => {
                                const newGrid = produce(grid, (gridCopy) => {
                                    gridCopy[i][j] = grid[i][j] ? 0 : 1;
                                });
                                setGrid(newGrid);
                            }}
                            className="box"
                            style={{ background: grid[i][j] ? "pink" : undefined }}
                        ></div>
                    ))
                )}
            </div>
        </>
    );
}

export default App;
