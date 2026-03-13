
const Player1 = Player("Angela");
Player1.chooseFruit("🫐");
const Player2 = Player("Oscar");
Player2.chooseFruit("🍒");


function Player(name){
    let fruit = null;
    const chooseFruit = (userChoice) =>{
        fruit = userChoice;
    }
    const getFruit = () => fruit;

    return{name, chooseFruit, getFruit};
}

const turnManager = (() =>{
    let currentTurn = Player1.getFruit();
    const findTurn = () =>{
        if(currentTurn == Player1.getFruit()){
            currentTurn = Player2.getFruit()
        }
        else{
            currentTurn = Player1.getFruit();
        }
        return currentTurn;
    }
    const getCurrentTurn = () => currentTurn;
    return{findTurn, getCurrentTurn};
})();

const boardManager = (()=>{
    const drawWinLine = ()=>{
        const line = document.querySelector(".winningLine")
        const winCombo = winManager.determineWinner();
        switch(winCombo.join()){
            case "0,1,2": line.classList.add("top-row"); break;
            case "3,4,5": line.classList.add("middle-row"); break;
            case "6,7,8": line.classList.add("bottom-row"); break;
            case "0,3,6": line.classList.add("left-column"); break;
            case "1,4,7": line.classList.add("middle-column"); break;
            case "2,5,8": line.classList.add("right-column"); break;
            case "0,4,8": line.classList.add("left-diag"); break;
            case "2,4,6": line.classList.add("right-diag"); break;
                
        }
    }
    return{drawWinLine}
})();

const gameLogic = (()=>{
    let gamePad = [ "null", "null", "null",
                      "null", "null", "null",
                      "null", "null", "null"]
    let rounds = 0;
    const updateRounds = ()=>{ rounds++;}
    const getRounds = ()=> rounds;
    const updateGamePad = (index, content)=>{
        gamePad[index] = content;
    }

    const getGamePad = () => gamePad;

    return{updateGamePad, getGamePad, updateRounds, getRounds};
})();

const winManager = (()=>{
    let winningCombo = [
        //rows
        [0,1,2],
        [3,4,5],
        [6,7,8],
        //columns
        [0,3,6],
        [1,4,7],
        [2,5,8],
        //diagonal
        [0,4,8],
        [2,4,6]
    ]

    const determineWinner = () =>{
        let gameBoard = gameLogic.getGamePad();
        //remember that currentPlayer holds the fruit in play
        let currentPlayer = turnManager.getCurrentTurn();
        const winner = winningCombo.find(combo => combo.every(i => gameBoard[i] == currentPlayer));

        return winner;
    }

    return{determineWinner};
})();

const startGame = (() =>{
    const gamePlay = document.querySelector("#gameGrid");
    const generateBoard = () =>{
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = i;
            gamePlay.append(square);
            square.addEventListener("click", ()=>{
                square.textContent = turnManager.getCurrentTurn();
                gameLogic.updateGamePad(square.id, turnManager.getCurrentTurn());
                gameLogic.updateRounds();
                if(gameLogic.getRounds() >= 5){
                    if(winManager.determineWinner()){
                        //console.log(gameLogic.getGamePad());
                        boardManager.drawWinLine();
                    }
                }
                turnManager.findTurn();
                //console.log(gameLogic.getGamePad());
                
            }, {once: true});
            
        }
    }

    return{generateBoard};
})();
startGame.generateBoard();


