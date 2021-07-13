import React, { useState } from "react";
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
