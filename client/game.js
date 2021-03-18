function systemConst(); // This function defines constant

function initialize(); // This function initializes the game variables, including time, player HP, attack, defence and current value

function createBoard(); // This function creates a board (which is less than 4 crystals to form a vertical or horizontal line) when the game starts or no crystals cancelled after two continued moves. 

function updateBoard(); // This function generates the crystals randomly. Then it will refill the space after cancelling the crystals. For each move, if more than 3 crystals are next to each other and form a straight line, those crystals will be cancelled.

function move(pos, dir); // This function will rotate the corresponding four cells.

function selectCell(x, y) // This function will handle the event of mouse click. (the player need to first select the position, then select the direction by clicking the neighbor of the selected cell, if the player selected a invalid cell, it will change the position)

function attack();
function defense();
function recovery();
function calculateDamage();
function fight() {
    var damage = calculateDamage();
    //there is a formula to calculate damage
}

function EndTimeCheck(); // Check the HP when the time is up in each section. The winner will be selected by the highest HP.

function EndHPCheck(); // Check the HP of players. If any of them equal to 0, then another player will be the winner.


function

//Global variable
var chessboard[8][8];  //the value denotes the type of crystal in each cell
var player;
//1: Red
//2: Blue
//3: Green
//4: Yellow
//5: Enchanted Red
//6: Enchanted Blue
//7: Enchanted Green
//8: Enchanted Yellow

int time; //in ms
int A_HP;
int B_HP;

Constant 
//1: Red percentage=22.5%
//2: Blue percentage=22.5%
//3: Green=18%
//4: Yellow=27%
//5: Enchanted Red=2.5%
//6: Enchanted Blue=2.5%
//7: Enchanted Green=2%
//8: Enchanted Yellow=3%