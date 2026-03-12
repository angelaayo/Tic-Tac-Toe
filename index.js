
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
    const getCurentTurn = () => currentTurn;
    return{findTurn, getCurentTurn};
})();



const startGame = (() =>{
    const gamePlay = document.querySelector("#gamePlay")
    //ideally only call generate Once
    const generateBoard = () =>{
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            square.classList.add("square");
            gamePlay.append(square);
            square.addEventListener("click", ()=>{
                square.textContent = turnManager.getCurentTurn();
                turnManager.findTurn();
                
            })
            
        }
    }

    return{generateBoard};
})();
startGame.generateBoard();


