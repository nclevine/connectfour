var currentPlayer = 'red';
var winner = '';
var gameover = false;
var gameCells = document.querySelectorAll('.gamecell');

function newGame(){
  for (var i = 0; i < gameCells.length; i++) {
    gameCells[i].style.background = '';
    gameCells[i].setAttribute('data-filled', 'false');
  };
  gameover = false;
  currentPlayer = 'red';
  currentcolor.style.backgroundColor = currentPlayer;
  winner = '';
  result.innerText = '';
}

restart.addEventListener('click', newGame);

function findLowestUnoccupied(column){
  var columnCells = [];
  for (var i = 0; i < gameCells.length; i++) {
    if(gameCells[i].getAttribute('data-column') === column){
      columnCells.push(gameCells[i]);
    };
  };
  for (var i = columnCells.length - 1; i >= 0; i--) {
    if(columnCells[i].getAttribute('data-filled') === 'false'){
      return columnCells[i];
    };
  };
}

function claimCell(cell){
  var thisColumn = cell.getAttribute('data-column');
  var cellToFill = findLowestUnoccupied(thisColumn);
  if(cellToFill){
    cellToFill.style.backgroundColor = currentPlayer;
    cellToFill.setAttribute('data-filled', currentPlayer);
    return cellToFill;
  };
}

function changePlayer(){
  if (currentPlayer === 'red') {
    currentPlayer = 'black';
  } else{
    currentPlayer = 'red';
  };
  currentcolor.style.backgroundColor = currentPlayer;
}

function checkFilledBoard(){
  var occupiedCells = 0;
  for (var i = 0; i < gameCells.length; i++) {
    if(gameCells[i].getAttribute('data-filled') !== 'false'){
      occupiedCells++;
    };
  };
  if (occupiedCells === gameCells.length && winner === '') {
    result.innerText = 'everyone loses';
    gameover = true;
  };
}

function checkForWinner(cell){
  var occupant = cell.getAttribute('data-filled');
  var row = parseInt(cell.getAttribute('data-row'));
  var column = parseInt(cell.getAttribute('data-column'));
  var cellsBelow = [];
  var cellsLeft = [];
  var cellsRight = [];
  var cellsDiagUL = [];
  var cellsDiagUR = [];
  var cellsDiagBL = [];
  var cellsDiagBR = [];

  for (var i = 0; i < gameCells.length; i++){
    var thisColumn = parseInt(gameCells[i].getAttribute('data-column'));
    var thisRow = parseInt(gameCells[i].getAttribute('data-row'));
    if(thisColumn === column && thisRow > row){
      cellsBelow.push(gameCells[i]);
    };
    if(thisRow === row){
      if(thisColumn < column){
        cellsLeft.push(gameCells[i]);
      } else if(thisColumn > column){
        cellsRight.push(gameCells[i]);
      };
    };
    for (var y = 1; y < column; y++){
      if(thisColumn === column - y){
        if(thisRow === row - y){
          cellsDiagUL.push(gameCells[i]);
        } else if(thisRow === row + y){
          cellsDiagBL.push(gameCells[i]);
        };
      };
    };
    for(var z = column + 1; z < 8; z++){
      if(thisColumn === z){
        if(thisRow === row - (z - column)){
          cellsDiagUR.push(gameCells[i]);
        } else if(thisRow === row + (z - column)){
          cellsDiagBR.push(gameCells[i]);
        };
      };
    };
  };
  if(checkForChain(occupant, cellsBelow) >= 3){
    winner = currentPlayer;
  } else if(checkForChain(occupant, cellsRight) + checkForChainBackwards(occupant, cellsLeft) >= 3){
    winner = currentPlayer;
  } else if(checkForChainBackwards(occupant, cellsDiagUL) + checkForChain(occupant, cellsDiagBR) >= 3){
    winner = currentPlayer;
  } else if(checkForChain(occupant, cellsDiagBL) + checkForChainBackwards(occupant, cellsDiagUR) >= 3){
    winner = currentPlayer;
  };
  if(winner !== ''){
    result.innerText = winner + 'wins!';
    gameover = true;
  }
}

function checkForChain(cellOccupant, neighborArray){
  var chain = 0;
  if (neighborArray.length === 0) {
    return 0;
  } else{
    for (var i = 0; i < neighborArray.length; i++) {
      if(neighborArray[i].getAttribute('data-filled') === cellOccupant){
        chain++;
      };
    };
  };
  return chain;
}

function checkForChainBackwards(cellOccupant, neighborArray){
  var chain = 0;
  if (neighborArray.length === 0) {
    return 0;
  } else{
    for (var i = neighborArray.length - 1; i >= 0; i--) {
      if(neighborArray[i].getAttribute('data-filled') === cellOccupant){
        chain++;
      };
    };
  };
  return chain;
}

for (var g = 0; g < gameCells.length; g++) {
  gameCells[g].addEventListener('mouseenter', function(){
    var bottomCell = findLowestUnoccupied(this.getAttribute('data-column'));
    if(bottomCell.getAttribute('data-filled') === 'false'){
      bottomCell.style.backgroundColor = currentPlayer;
    };
  });

  gameCells[g].addEventListener('mouseleave', function(){
    var bottomCell = findLowestUnoccupied(this.getAttribute('data-column'));
    if(bottomCell.getAttribute('data-filled') === 'false'){
      bottomCell.style.backgroundColor = '';
    };
  });

  gameCells[g].addEventListener('click', function(){
    if(gameover === false){
      var filledCell = claimCell(this);
      checkForWinner(filledCell);
      checkFilledBoard();
      changePlayer();
    };
  });
};