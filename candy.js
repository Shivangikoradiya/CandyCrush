// Array containing different candy colors
var candyColors = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];

// 2D array representing the game board
var gameBoard = [];
var numRows = 9;
var numColumns = 9;

// Variable to store the player's score
var playerScore = 0;

// Variables to store currently dragged tile and the tile it's dropped on
var currentTile;
var targetTile;



// Initialize the game when the window loads
window.onload = function() {
    initializeGame();

    // Every 1/10th of a second, perform crushing, sliding, and candy generation
    window.setInterval(function() {
        crushCandies();
        slideCandies();
        generateCandies();
    }, 100);
}

// window.onload = function() {
//     // Call the function to initialize the game
//     initializeGame();

//     // Call the function to crush candies
//     crushCandies();

//     // Call the function to slide candies
//     slideCandies();

//     // Call the function to generate candies
//     generateCandies();
// };

// Function to initialize the game
function initializeGame() {
    // Loop through each row
    for (let r = 0; r < numRows; r++) {
        let rowTiles = [];
        // Loop through each column in the current row
        for (let c = 0; c < numColumns; c++) {
            // Create a new image element (tile)
            let tile = document.createElement("img");
            // Assign a unique identifier (ID) to the tile based on its row and column
            tile.id = r.toString() + "-" + c.toString();
            
            // Log the ID of the tile to the console (for debugging purposes)
            // console.log(tile.id);
            
            // Assign a random candy color image to the tile
            tile.src = "./images/" + getRandomCandyColor() + ".png";

            console.log(getRandomCandyColor());

            // Adding drag functionality to the tile
            tile.addEventListener("dragstart", startDragging);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dropTile);
            tile.addEventListener("dragend", endDragging);

            // Append the tile to the game board container in the HTML document
            document.getElementById("board").append(tile);
            
            // Push the tile to the current row's array of tiles
            rowTiles.push(tile);
        }
        // Push the array of tiles for the current row to the game board array
        gameBoard.push(rowTiles);
    }

    // Log the game board array to the console (for debugging purposes)
    console.log(gameBoard);
}


// Function to randomly select a candy color
function getRandomCandyColor() {
    return candyColors[Math.floor(Math.random() * candyColors.length)];
}



// Function called when a tile is clicked and dragged
function startDragging() {
    currentTile = this;
}

// Function to allow dropping
function dragOver(event) {
    event.preventDefault();
}

// Function called when a dragged tile enters another tile
function dragEnter(event) {
    event.preventDefault();
}

// Function called when a dragged tile leaves another tile
function dragLeave() {}

// Function called when a dragged tile is dropped onto another tile
function dropTile() {
    targetTile = this;
}

// Function called after dragging is completed
function endDragging() {
    if (currentTile.src.includes("blank") || targetTile.src.includes("blank")) {
        return;
    }

    let currentTileCoords = currentTile.id.split("-");
    let currentRow = parseInt(currentTileCoords[0]);
    let currentColumn = parseInt(currentTileCoords[1]);

    let targetTileCoords = targetTile.id.split("-");
    let targetRow = parseInt(targetTileCoords[0]);
    let targetColumn = parseInt(targetTileCoords[1]);

    // Check if the target tile is one column to the left and in the same row
    let moveLeft = (targetColumn === currentColumn - 1) && (currentRow === targetRow);

    // Check if the target tile is one column to the right and in the same row
    let moveRight = (targetColumn === currentColumn + 1) && (currentRow === targetRow);

    // Check if the target tile is one row above and in the same column
    let moveUp = (targetRow === currentRow - 1) && (currentColumn === targetColumn);

    // Check if the target tile is one row below and in the same column
    let moveDown = (targetRow === currentRow + 1) && (currentColumn === targetColumn);

    // Check if any of the above conditions are true (i.e., the target tile is adjacent to the current tile)
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        // Store the current and target tile images
        let currentImg = currentTile.src;
        let targetImg = targetTile.src;
    
        // Swap the images of the current and target tiles
        currentTile.src = targetImg;
        targetTile.src = currentImg;
    
        // Check if the move results in a valid game state
        let validMove = checkValidMoves();
        if (validMove) {
            // If the move is valid, crush the candies and slide them
            crushCandies();
            slideCandies();
        } else {
            // If the move is not valid, revert the tile images back to their original state
            console.log("Your move is invalid");
            currentTile.src = currentImg;
            targetTile.src = targetImg;
        }
    }
    
}

// Function to check if there are any valid moves on the board
function checkValidMoves() {
    // Check rows
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numColumns - 2; c++) {
            let candy1 = gameBoard[r][c];
            let candy2 = gameBoard[r][c + 1];
            let candy3 = gameBoard[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank") && !candy2.src.includes("blank") && !candy3.src.includes("blank")){
                return true;
            }
        }
    }

    // Check columns
    for (let c = 0; c < numColumns; c++) {
        for (let r = 0; r < numRows - 2; r++) {
            let candy1 = gameBoard[r][c];
            let candy2 = gameBoard[r + 1][c];
            let candy3 = gameBoard[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank") && !candy2.src.includes("blank") && !candy3.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

// Function to remove matched candies and update the player's score
function crushCandies() {
    crushThreeCandies();
    document.getElementById("score").innerText = playerScore;
}

// Function to remove matched candies if there are three or more in a row or column
function crushThreeCandies() {
    // Check rows
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numColumns - 2; c++) {
            let candy1 = gameBoard[r][c];
            let candy2 = gameBoard[r][c + 1];
            let candy3 = gameBoard[r][c + 2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank") && !candy2.src.includes("blank") && !candy3.src.includes("blank")){
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                playerScore += 10;
            }
        }
    }

    // Check columns
    for (let c = 0; c < numColumns; c++) {
        for (let r = 0; r < numRows - 2; r++) {
            let candy1 = gameBoard[r][c];
            let candy2 = gameBoard[r + 1][c];
            let candy3 = gameBoard[r + 2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank") && !candy2.src.includes("blank") && !candy3.src.includes("blank")){
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                playerScore += 10;
            }
        }
    }
}

// Function to slide candies downwards when there are empty spaces
function slideCandies() {
    // Loop through each column
    for (let c = 0; c < numColumns; c++) {
        // Start the index from the bottom row
        let index = numRows - 1;
        
        // Iterate from the bottom row to the top row
        for (let r = numRows - 1; r >= 0; r--) {
            // Check if the current tile is not a "blank" tile
            if (!gameBoard[r][c].src.includes("blank")) {
                // If the tile is not "blank", move it to the bottommost empty space
                gameBoard[index][c].src = gameBoard[r][c].src;
                // Decrement the index to move to the next row upwards
                index -= 1;
            }
        }

        // Fill the remaining empty spaces at the top with "blank" tiles
        for (let r = index; r >= 0; r--) {
            gameBoard[r][c].src = "./images/blank.png";
        }
    }
}


// Function to generate new candies at the top of the board
function generateCandies() {
    for (let c = 0; c < numColumns; c++) {
        if (gameBoard[0][c].src.includes("blank")) {
            gameBoard[0][c].src = "./images/" + getRandomCandyColor() + ".png";
        }
    }
}
