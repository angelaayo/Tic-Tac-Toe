const startGame = (() =>{
    const MIN_ROUNDS_FOR_WIN = 5;
    const gamePlay = document.querySelector("#gameGrid");
    const generateBoard = () =>{
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            const iconHolder = document.createElement("img");
            iconHolder.classList.add("icon");
            square.append(iconHolder);
            square.classList.add("square");
            square.id = i;
            gamePlay.append(square);
            square.addEventListener("click", ()=>{
                iconHolder.src = turnManager.getCurrentTurn().getIcon();
                gameLogic.updateGamePad(square.id, turnManager.getCurrentTurn().getIcon());
                gameLogic.updateRounds();
                if(gameLogic.getRounds() >= MIN_ROUNDS_FOR_WIN){
                    if(winManager.determineWinner()){
                        //console.log(gameLogic.getGamePad());
                        boardManager.drawWinLine();
                        //add visual pop up
                        return;
                    }
                }
                turnManager.findTurn();
                //console.log(gameLogic.getGamePad());
                
            }, {once: true});
            
        }
    }

    return{generateBoard};
})();

function Player(name){
    let icon = null;
    const chooseIcon = (userChoice) =>{
        icon = userChoice;
    }
    const getIcon = () => icon;

    return{name, chooseIcon, getIcon};
}

const gamePlayers = (()=>{
    const Player1 = Player("player1");
    const Player2 = Player("player2");
    Player1.chooseIcon("heart.png");
    Player2.chooseIcon("star.png");


    startGame.generateBoard();

    return{Player1, Player2};

})();



const turnManager = (() =>{
    let currentTurn = gamePlayers.Player1;
    const findTurn = () =>{
        if(currentTurn == gamePlayers.Player1){
            currentTurn = gamePlayers.Player2;
        }
        else{
            currentTurn = gamePlayers.Player1;
        }
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
    let gamePad = [ null, null, null,
                      null, null, null,
                      null, null, null]
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
        let currentPlayer = turnManager.getCurrentTurn();
        console.log(currentPlayer);
        const winner = winningCombo.find(combo => combo.every(i => gameBoard[i] == currentPlayer.getIcon()));

        return winner;
    }

    return{determineWinner};
})();




