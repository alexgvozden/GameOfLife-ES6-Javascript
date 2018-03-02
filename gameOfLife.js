// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life



/* 
The universe of the Game of Life is an infinite two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, alive or dead, or "populated" or "unpopulated". Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:

1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed—births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick (in other words, each generation is a pure function of the preceding one). The rules continue to be applied repeatedly to create further generations.

*/
class GameOfLife {

  constructor(initialState, tickFreq = 3) {
    this.initialState = new Set();

    // convert from object to string for correct compare function
    initialState.forEach(el => this.initialState.add(JSON.stringify(el)));

    // start tick
    setInterval(() => { this.tick(); }, tickFreq * 1000);

  }

  tick() {
    let live;
    let newState = new Set();

    // initialize checked cells
    this.checkedEmptyCells = new Set();

    this.initialState.forEach(el => {

      // process this live cells and its neighbours
      const { live, reliveCells } = this.checkCellAndNeighbouringCells(el, true);
      //  console.log("cells ", live, reliveCells);

      // rule no 2 
      // rule 1 and 3 are not needed to be coverd, we just don't pass to next cycle
      if (live == 2 || live == 3) {
        newState.add(el);
      }

      // add cells that are relived to new state
      reliveCells.forEach(el2 => !newState.has(el2) ? newState.add(el2) : '');

    });

    this.initialState = newState;

    console.log(this.initialState);
  }


  /**
  * Check number of live cells and empty neighboring cells for reliving :)
  */
  checkCellAndNeighbouringCells(pos, checkForDeadCells = false) {
    let live = 0;
    let curr;
    let objEl = JSON.parse(pos);
    let reliveCells = [];
    let relive;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) continue;

        curr = JSON.stringify({ x: objEl.x + i, y: objEl.y + j });

        if (this.initialState.has(curr)) {
          // increase count of live cells around primary cell
          live++;
        } else if (checkForDeadCells && !this.checkedEmptyCells.has(curr)) {
          // mark this empty was checed
          this.checkedEmptyCells.add(curr);

          // if cell is not live, we can check if it becomes alive
          relive = this.checkCellAndNeighbouringCells(curr);

          // rule no 4
          if (relive.live == 3) {
            reliveCells.push(curr);
          }
        }
      }
    }

    // console.log("Live elements for ", !checkForDeadCells ? " empty check " : "", objEl, live, reliveCells);

    return { live: live, reliveCells: reliveCells };
  }
}


const gameA = new GameOfLife([{ x: 3, y: 2 }, { x: 3, y: 1 }, { x: 3, y: 3 }]);
