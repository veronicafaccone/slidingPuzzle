# slidingPuzzle
Sliding puzzle (9-puzzle) implementation in Vue JS and CSS.
## How to Play
* The goal of the game is to show how to arrange the tiles in order (as shown in the `Goal`)
* Swipe on the tile you want to move; it will shift to the empty spot
* Clicking on `shuffle` button tiles will move to another random position
* Clicking on `random image` button image to solve will change
* Clicking on `solution` button the tiles will move to the correct position
## Install

    $ git clone https://github.com/veronicafaccone/slidingPuzzle.git
    $ cd slidingPuzzle
    $ npm install
## Features
* Shuffle function implemented with underscore JS
* Solve function that (naively) solves the puzzle
* Random image function which allows to change the image to play with (6 possibile image)
* Mobile-friendly
  * CSS `position: absolute` animations
  * Optimized for both smaller and larger screen sizes
  * Works with gesture on touch devices thanks to Hammer JS
* Pure Vue Javascript
