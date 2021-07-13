import React, { useCallback, useRef, useState } from "react";
import { produce } from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];

const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
};

function App() {
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid();
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

        // simulation logic
        setGrid((g) => {
            return produce(g, (gridCopy) => {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numCols; j++) {
                        let neighbors = 0;
                        // this will tell us how many neighbors a given cell has
                        // the alternative would be to do a bunch of if statements to check each neighbor
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newJ = j + y;
                            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                                neighbors += g[newI][newJ];
                            }
                        });

                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][j] = 0;
                        } else if (g[i][j] === 0 && neighbors === 3) {
                            gridCopy[i][j] = 1;
                        }
                    }
                }
            });
        });

        // simulate
        setTimeout(runSimulation, 100);
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running);
                    if (!running) {
                        runningRef.current = true;
                        runSimulation();
                    }
                }}
            >
                {running ? "stop" : "start"}
            </button>
            <button
                onClick={() => {
                    setGrid(generateEmptyGrid());
                }}
            >
                clear
            </button>
            <button
                onClick={() => {
                    const rows = [];
                    for (let i = 0; i < numRows; i++) {
                        rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
                    }
                    setGrid(rows);
                }}
            >
                random
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
