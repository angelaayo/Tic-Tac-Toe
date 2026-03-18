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
                turnManager.updateTurnVisual();
                //console.log(gameLogic.getGamePad());
                
            }, {once: true});
            
        }
    }

    return{generateBoard};
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
    const startBtn = document.querySelector(".startBtn");
    startBtn.addEventListener("click", ()=>{
        startGame.generateBoard();
        mainContainer.classList.add("hideDisplay");
        gameContainer.classList.remove("hideDisplay");

    })
    const Player1 = Player("player1");
    const human = Player("human");
    const bot = Player("bot");
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



const turnManager = (() =>{
    const turnText = document.querySelectorAll(".turnText");
    let currentTurn = gameManager.Player1;
    const findTurn = () =>{
        if(currentTurn == gameManager.Player1){
            currentTurn = gameManager.getPlayer2();
        }
        else{
            currentTurn = gameManager.Player1;
        }
    }
    const getCurrentTurn = () => currentTurn;

    const updateTurnVisual = ()=>{
        turnText.forEach((turnIcon)=>{
            if(turnIcon.classList.contains("highlight")){
                turnIcon.classList.remove("highlight");
            }
            else{
                turnIcon.classList.add("highlight");
            }
        })
    }
    return{findTurn, getCurrentTurn, updateTurnVisual};
})();

const boardManager = (()=>{
    const drawWinLine = ()=>{
        const winCombo = winManager.determineWinner();
        winCombo.forEach(num =>{
            const square = document.getElementById(num);
            square.classList.add("win");
        })

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




