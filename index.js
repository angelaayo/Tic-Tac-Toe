
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

const boardManger = (()=>{


})();

const gameLogic = (()=>{
    let gamePad = [ "null", "null", "null",
                      "null", "null", "null",
                      "null", "null", "null"]
    const updateGamePad = (index, content)=>{
        gamePad[index] = content;
    }

    const getGamePad = () => gamePad;

    return{updateGamePad, getGamePad};
})();

const startGame = (() =>{
    const gamePlay = document.querySelector("#gamePlay");
    const generateBoard = () =>{
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = i;
            gamePlay.append(square);
            square.addEventListener("click", ()=>{
                square.textContent = turnManager.getCurrentTurn();
                gameLogic.updateGamePad(square.id, turnManager.getCurrentTurn());
                turnManager.findTurn();
                console.log(gameLogic.getGamePad());
                
            }, {once: true});
            
        }
    }

    return{generateBoard};
})();
startGame.generateBoard();


