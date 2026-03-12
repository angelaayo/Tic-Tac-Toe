const startGame = (() =>{
    function generateBoard(){
        const gamePlay = document.querySelector("#gamePlay")
        for(let i=0; i<9; i++){
            const square = document.createElement("div");
            square.classList.add("square");
            gamePlay.append(square);
            
        }
    }

    return{generateBoard}
})();
startGame.generateBoard();
