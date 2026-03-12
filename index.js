function Player(name){
    let fruit = null;
    const chooseFruit = (userChoice) =>{
        fruit = userChoice;
    }
    const getFruit = () => fruit;

    return{name, chooseFruit, getFruit};
}



const startGame = (() =>{
    //ideally only call generate Once
    function generateBoard(){
        const gamePlay = document.querySelector("#gamePlay")
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            square.classList.add("square");
            gamePlay.append(square);
            square.addEventListener("click", ()=>{
                square.textContent = Player1.getFruit();
                console.log(Player1.getFruit());
            })
            
        }
    }

    return{generateBoard};
})();
startGame.generateBoard();
const Player1 = Player("Angela");
Player1.chooseFruit("🫐");
