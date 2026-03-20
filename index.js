const startGame = (() =>{
    const MIN_ROUNDS_FOR_WIN = 5;
    const gamePlay = document.querySelector("#gameGrid");
    const generateBoard = () =>{
        turnManager.updateTurnVisual();
        gamePlay.innerHTML = "";
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
                        popUp.show(turnManager.getCurrentTurn().name + "wins the game");
                        return;
                    }
                    if(gameLogic.getRounds == 9){
                        popUp.show("It's a tie");
                        return;
                    }
                }
                if((selectionVisual.getSelected() =="Bot") &&
                    turnManager.getCurrentTurn == gameManager.getPlayer2()){
                        botAI.playBotTurn();
                        if(winManager.determineWinner()){
                            boardManager.drawWinLine();
                            popUp.show(turnManager.getCurrentTurn().name + "wins the game");
                            return;
                        }
                        if(gameLogic.getRounds() ==9){
                            popUp.show("It's a tie");
                            return;
                        }
                    }
                    
                turnManager.findTurn();
                turnManager.updateTurnVisual();
                //console.log(gameLogic.getGamePad());
                
            }, {once: true});
            
        }
    }

    return{generateBoard};
})();

const popUp = (()=>{
    const overlay = document.querySelector("#overlay");
    const winMsg = document.querySelector(".winnerTxt");

    const show = (message) =>{
        winMsg.textContent = message;
        overlay.classList.add("visible");
    }

    const hide = ()=>{
        overlay.classList.remove("visible");
    }

    return{show, hide}
})();

const selectionVisual = (()=>{
    const PlayerBtn = document.querySelectorAll(".choiceCircle");
    const secondIcon = document.querySelector("#player2Img");
    let selected = null;
    PlayerBtn.forEach((btn)=>{
        btn.addEventListener("click", ()=>{
            const sibling = btn.nextElementSibling || btn.previousElementSibling;
            btn.classList.add("highlight");
            selected = btn.textContent;
            gameManager.updatePlayer2();
            sibling.classList.remove("highlight");
            secondIcon.src = gameManager.getPlayer2().getIcon();
        })
    })
    const getSelected = ()=> selected;

    return{getSelected};
})();

function Player(name){
    let icon = null;
    const chooseIcon = (userChoice) =>{
        icon = userChoice;
    }
    const getIcon = () => icon;

    return{name, chooseIcon, getIcon};
}

const gameManager = (()=>{
    const mainContainer = document.querySelector(".secondContainer");
    const gameContainer = document.querySelector(".outerContainer");
    const backBtn = document.querySelectorAll(".backBtn");
    const resetBtn = document.querySelectorAll(".resetBtn");
    const startBtn = document.querySelector(".startBtn");
    startBtn.addEventListener("click", ()=>{
        startGame.generateBoard();
        gameLogic.resetRound();
        gameLogic.createGamePad();
        mainContainer.classList.add("hideDisplay");
        gameContainer.classList.remove("hideDisplay");
        turnManager.turnReset();
        turnManager.updateTurnVisual();

    });
    backBtn.forEach((button)=>{
        button.addEventListener("click", ()=>{
            gameContainer.classList.add("hideDisplay");
            mainContainer.classList.remove("hideDisplay");
            popUp.hide();
        })
    })

    resetBtn.forEach((button)=>{
        button.addEventListener("click", ()=>{
            startGame.generateBoard();
            gameLogic.resetRound();
            gameLogic.createGamePad();
            turnManager.turnReset();
            turnManager.updateTurnVisual();
            popUp.hide();
        })
    })
    const Player1 = Player("Player1");
    const human = Player("Player2");
    const bot = Player("Player2");
    let Player2 = human;
    bot.chooseIcon("moon.png");
    Player1.chooseIcon("heart.png");
    human.chooseIcon("star.png");

    const updatePlayer2 = ()=>{
        if(selectionVisual.getSelected() =="Player"){
            Player2 = human;
        }
        else{
            Player2 = bot;
        }
    }

    const getPlayer2 = ()=> Player2;




    return{Player1, updatePlayer2, getPlayer2};

})();

const botAI = (()=>{
    const isMovesLeft = (board) => board.includes(null); 
    const evaluate = (board) =>{
        const botIcon = gameManager.getPlayer2().getIcon();
        const playerIcon = gameManager.Player1.getIcon();

        const winCombos = winManager.getWinCombo();
        for(let combo of winCombos){
            const values = combo.map(i => board[i]);
            if(values.every(v => v== botIcon)) return +10;
            if(values.every(v => v== playerIcon)) return -10;
        }
        return 0;
        
    };

    const minimax = (board, depth, isMax) =>{
        const score = evaluate(board);
        if(score == 10) return 10- depth;
        if(score == -10) return -10 + depth;
        if(!isMovesLeft(board)) return 0;

        const botIcon = gameManager.getPlayer2().getIcon();
        const playerIcon = gameManager.Player1.getIcon();

        if(isMax){
            let best = -1000;
            for(let i=0; i<9; i++){
                if(board[i] == null){
                    board[i] = botIcon;
                    best = Math.max(best, minimax(board, depth+1, false));
                    board[i] = null;
                }
            }
            return best;
        }
        else{
            let best = 1000;
            for(let i=0; i<9; i++){
                if(board[i] == null){
                    board[i] = playerIcon;
                    best = Math.min(best, minimax(board, depth+1, true));
                    board[i] = null;
                }
            }
            return best;
        }
    };

    const findBestMove = () =>{
        const board = gameLogic.getGamePad().slice();
        const botIcon = gameManager.getPlayer2().getIcon();

        let bestVal = -1000;
        let bestIndex = -1;

        for(let i=0; i<9; i++){
            if(board[i] ==null){
                board[i] = botIcon;
                let moveVal = minimax(board, 0, false);
                board[i] = null;

                if(moveVal > bestVal){
                    bestVal = moveVal;
                    bestIndex = i;
                }
            }
        }
        return bestIndex;
    }

    const playBotTurn = ()=>{
        const bestIndex = findBestMove();
        if(bestIndex == -1){
            return;
        }
        const square = document.getElementById(bestIndex);
        const iconHolder = square.querySelector(".icon");

        iconHolder.src = turnManager.getCurrentTurn().getIcon();
        gameLogic.updateGamePad(bestIndex, turnManager.getCurrentTurn().getIcon());
        gameLogic.updateRounds();

        turnManager.findTurn();
        turnManager.updateTurnVisual();

        
    }
    return{findBestMove, playBotTurn};
})();




const turnManager = (() =>{
    const turnText = document.querySelectorAll(".turnText");
    let currentTurn = gameManager.Player1;
    //console.log(gameManager.Player1.name);
    const findTurn = () =>{
        if(currentTurn == gameManager.Player1){
            currentTurn = gameManager.getPlayer2();
        }
        else{
            currentTurn = gameManager.Player1;
        }
    }
    const getCurrentTurn = () => currentTurn;

    const turnReset = ()=>{currentTurn = gameManager.Player1;}
    //update so turn visual is synced to whose turn it actually is 
    const updateTurnVisual = ()=>{
        turnText.forEach((turnIcon)=>{
            if(turnIcon.id == currentTurn.name){
                turnIcon.classList.add("highlight");
            }
            else{
                turnIcon.classList.remove("highlight");
            }
        })
    }
    return{findTurn, getCurrentTurn, updateTurnVisual, turnReset};
})();

const boardManager = (()=>{
    const drawWinLine = ()=>{
        const winCombo = winManager.determineWinner();
        winCombo.forEach(num =>{
            const square = document.getElementById(num);
            square.classList.add("highlight");
        })

    }
    return{drawWinLine}
})();

const gameLogic = (()=>{
    let gamePad = [];
    const createGamePad = ()=>{
        gamePad = [ null, null, null,
                      null, null, null,
                      null, null, null];
    }
    let rounds = 0;
    const updateRounds = ()=>{ rounds++;}
    const getRounds = ()=> rounds;
    const resetRound = () =>{rounds = 0;}
    const updateGamePad = (index, content)=>{
        gamePad[index] = content;
    }

    const getGamePad = () => gamePad;

    return{updateGamePad, getGamePad, updateRounds, getRounds, resetRound, createGamePad};
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
        const winner = winningCombo.find(combo => combo.every(i => gameBoard[i] == currentPlayer.getIcon()));

        return winner;
    }

    const getWinCombo = () => winningCombo;

    return{determineWinner, getWinCombo};
})();




