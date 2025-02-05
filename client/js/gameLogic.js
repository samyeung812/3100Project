function initDissolveValue() {
    var dissolve_value =
    {
        attack_increase : 0,
        defence_increase : 0,
        HP_increase : 0,
        attack_times : 0.0,
    };
    return dissolve_value;
}

function crystalGenerate()
{	
	var testis = Math.trunc(Math.random() * 1000)+1;
	//document.write(testis + " ");
	if (1 <= testis && testis  <= 25)
		return 1;
	else if (26 <= testis && testis  <= 50)
		return 2;
	else if (51 <= testis && testis  <= 70)
		return 3;
	else if (71 <= testis && testis  <= 100)
		return 4;
	else if (101 <= testis && testis  <= 325)
		return 5;
	else if (326 <= testis && testis  <= 550)
		return 6;
	else if (551 <= testis && testis  <= 730)
		return 7;
	else if (731 <= testis && testis  <= 1000)
		return 8;
}

function check_dissolve(chess_board, callback) {
    dissolve_value = initDissolveValue();
    dissolved = 0;
    dissolve(chess_board, () => {
        dissolve_value.attack_increase = Math.round(dissolve_value.attack_increase * (1 + (dissolved -1 ) * 0.2));
        dissolve_value.defence_increase = Math.round(dissolve_value.defence_increase * (1 + (dissolved -1 ) * 0.2));
        dissolve_value.HP_increase = Math.round(dissolve_value.HP_increase * (1 + (dissolved -1 ) * 0.2));
        //document.write(dissolve_value.attack_increase + "<br>" + dissolve_value.defence_increase + "<br>", dissolve_value.HP_increase + "<br>" + dissolve_value.attack_times + "<br><br>");
        // return {unchanged: not_dissolve, dissolve_value: dissolve_value}; // meow!
        callback();
    })
}

function dissolve(chess_board, callback) {
    var A = Array(10).fill().map(() => Array(10).fill(0));
    var B = Array(10).fill().map(() => Array(10).fill(0));
    var C = Array(10).fill().map(() => Array(10).fill(0));
    var D = Array(10).fill().map(() => Array(10).fill(0));
    var E = Array(10).fill().map(() => Array(10).fill(0));

    for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
            var tmp = Math.trunc((chess_board[i][j] - 1) / 4) * ((chess_board[i][j] - 1) % 4 + 1);
            if (tmp==0) A[i][j] = 1;
            if (tmp==1) B[i][j] = 1;
            if (tmp==2) C[i][j] = 1;
            if (tmp==3) D[i][j] = 1;
            if (tmp==4) E[i][j] = 1;
        }
    }
    
    for (var i=0;i<8;i++)
     {
         for (var j=0;j<8;j++)
         {
             if (Math.abs(A[i][j])==1 && Math.abs(A[i][j+1])==1 && Math.abs(A[i][j+2])==1)
             {
                 A[i][j]=-1;
                 A[i][j+1]=-1;
                 A[i][j+2]=-1;
             }
            if (Math.abs(B[i][j])==1 && Math.abs(B[i][j+1])==1 && Math.abs(B[i][j+2])==1)
             {
                 B[i][j]=-1;
                 B[i][j+1]=-1;
                 B[i][j+2]=-1;
             }
             if (Math.abs(C[i][j])==1 && Math.abs(C[i][j+1])==1 && Math.abs(C[i][j+2])==1)
             {
                 C[i][j]=-1;
                 C[i][j+1]=-1;
                 C[i][j+2]=-1;
             }
             if (Math.abs(D[i][j])==1 && Math.abs(D[i][j+1])==1 && Math.abs(D[i][j+2])==1)
             {
                 D[i][j]=-1;
                 D[i][j+1]=-1;
                 D[i][j+2]=-1;
             }
             if (Math.abs(E[i][j])==1 && Math.abs(E[i][j+1])==1 && Math.abs(E[i][j+2])==1)
             {
                 E[i][j]=-1;
                 E[i][j+1]=-1;
                 E[i][j+2]=-1;
             }
         }
     }
     for (var j=0;j<8;j++)
     {
         for (var i=0;i<8;i++)
         {
             if (Math.abs(A[i][j])==1 && Math.abs(A[i+1][j])==1 && Math.abs(A[i+2][j])==1)
             {
                 A[i][j]=-1;
                 A[i+1][j]=-1;
                 A[i+2][j]=-1;
             }
            if (Math.abs(B[i][j])==1 && Math.abs(B[i+1][j])==1 && Math.abs(B[i+2][j])==1)
             {
                 B[i][j]=-1;
                 B[i+1][j]=-1;
                 B[i+2][j]=-1;
             }
             if (Math.abs(C[i][j])==1 && Math.abs(C[i+1][j])==1 && Math.abs(C[i+2][j])==1)
             {
                 C[i][j]=-1;
                 C[i+1][j]=-1;
                 C[i+2][j]=-1;
             }
             if (Math.abs(D[i][j])==1 && Math.abs(D[i+1][j])==1 && Math.abs(D[i+2][j])==1)
             {
                 D[i][j]=-1;
                 D[i+1][j]=-1;
                 D[i+2][j]=-1;
             }
             if (Math.abs(E[i][j])==1 && Math.abs(E[i+1][j])==1 && Math.abs(E[i+2][j])==1)
             {
                 E[i][j]=-1;
                 E[i+1][j]=-1;
                 E[i+2][j]=-1;
             }
         }
     }
    for (var i=0;i<8;i++) {
        for (var j=0;j<8;j++) {
            if (A[i][j]!=-1) A[i][j] = 0;
            if (B[i][j]!=-1) B[i][j] = 0;
            if (C[i][j]!=-1) C[i][j] = 0;
            if (D[i][j]!=-1) D[i][j] = 0;
            if (E[i][j]!=-1) E[i][j] = 0;
        }
    }
    
    var total_com = 0;
    total_com = each_type_combo(A, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(B, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(C, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(D, chess_board, total_com, dissolve_value);
    total_com = each_type_combo(E, chess_board, total_com, dissolve_value);
    dissolved += total_com;
    
    updateGameBoard();
    if(total_com == 0) {
        callback();
    } else {
        setTimeout(fallAndFill, 500, chess_board, callback);
    }
}

function fallAndFill(chess_board, callback) {
    var falled = false;

    for(var y = 7; y >= 1; y--) {
        for(var x = 0; x < 8; x++) {
            if(chess_board[y][x] == -1) {
                falled = true;
                chess_board[y][x] = chess_board[y-1][x];
                chess_board[y-1][x] = -1;
            }
        }
    }
    
    for(var x = 0; x < 8; x++) {
        if(chess_board[0][x] == -1) {
            chess_board[0][x] = crystalGenerate();
        }
    }

    updateGameBoard();
    if(falled) {
        setTimeout(fallAndFill, 200, chess_board, callback);
    } else {
        setTimeout(dissolve, 200, chess_board, callback);
    }
}

function each_type_combo(A, chess_board, total_com, dissolve_value)
{
	var combo = 0;
	for (var i = 0; i <= 7; i++)
		for (var j = 0; j <= 7; j++)
		{
			if (A[i][j] == -1)
			{
				var crystal_in_combo = [0, 0, 0, 0, 0]; // [0]: no. of crystal [1]: attack type [2]: def type [3]: HP type [4]: attack times, note that enchanted one will be double counted in [1-4]
				A[i][j] = ++combo;
				crystal_in_combo[(chess_board[i][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j]-1) / 4) - 1); // detect the type in array (no. of crystals), enchanted bonus will also be counted in 1-4
				chess_board[i][j] = -1;		//dissolved in board
				crystal_in_combo[0] = 1; //ACTUAL number of crystals, note that NO enchanted bonus is counted
				each_type_combo_recursion(A, chess_board, combo, crystal_in_combo, i, j);	//detect the neighbours can be dissolved or not
				// document.write("Crystal in combo = " + crystal_in_combo[0] + "   Attack crystal = " + crystal_in_combo[1] + "   Defence crystal = " + crystal_in_combo[2] + "   HP crystal = " + crystal_in_combo[3] + "   Attack times crystal = " + crystal_in_combo[4] + "<br>");
				dissolve_value.attack_increase += (0.25 + crystal_in_combo[0] * 0.25)  * crystal_in_combo[1] * 5; //bonus for dissolve 4 or above in a row * base number
				dissolve_value.defence_increase += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[2] * 5;
				dissolve_value.HP_increase += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[3] * 100;
				dissolve_value.attack_times += (0.25 + crystal_in_combo[0] * 0.25) * crystal_in_combo[4] * 0.33333334;
			}
			
		}
	return combo + total_com;
}

function each_type_combo_recursion(A,chess_board,this_com, crystal_in_combo,i, j)
{
    //document.write("br");
	if (i-1 >= 0 && A[i-1][j] == -1)
	{
		
		A[i-1][j] = this_com;
		crystal_in_combo[(chess_board[i-1][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i-1][j]-1) / 4) - 1);
		chess_board[i-1][j] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i-1, j);
	}
	
	if (j-1 >= 0 && A[i][j-1] == -1)
	{
		A[i][j-1] = this_com;
		crystal_in_combo[(chess_board[i][j-1]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j-1]-1) / 4) - 1);
		chess_board[i][j-1] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i, j-1);
	}
	
	if (i+1 <= 7 && A[i+1][j] == -1)
	{
		A[i+1][j] = this_com;
		crystal_in_combo[(chess_board[i+1][j]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i+1][j]-1) / 4) - 1);
		chess_board[i+1][j] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i+1, j);
	}
	
	if (j+1 <= 7 && A[i][j+1] == -1)
	{
		A[i][j+1] = this_com;
		crystal_in_combo[(chess_board[i][j+1]-1) % 4 + 1] += 1 + -1 * (Math.trunc((chess_board[i][j+1]-1) / 4) - 1);
		chess_board[i][j+1] = -1;
		crystal_in_combo[0]++;
		each_type_combo_recursion(A, chess_board, this_com, crystal_in_combo, i, j+1);
	}
}

function clockwise(gamestate, pointx, pointy, callback)
{
    if(pointx < 0 || pointx > 7) return false;
    if(pointy < 0 || pointy > 7) return false;
    updating = true;
    var chess_board = gamestate.chess_board;
	var moveO =  chess_board[pointy+1][pointx], moveR = chess_board[pointy][pointx], moveD = chess_board[pointy+1][pointx+1], moveRD = chess_board[pointy][pointx+1];
	chess_board[pointy][pointx] = moveO;
	chess_board[pointy+1][pointx] = moveD;
	chess_board[pointy][pointx+1] = moveR;
	chess_board[pointy+1][pointx+1] = moveRD;
    updateGameBoard();
    setTimeout(check_dissolve, 500, chess_board, () => {
        attack_exec(gamestate, dissolve_value);
        gamestate.now_player ^= 1;
        updateGameBoard();
        if(gamestate.player[0].HP <= 0) setTimeout(callback , 800, 1);
        if(gamestate.player[1].HP <= 0) setTimeout(callback , 800, 0);
        if(gamestate.player[0].HP > 0 && gamestate.player[1].HP > 0) updating = false;
    });
}

function anticlockwise(gamestate, pointx, pointy, callback)
{
    if(pointx < 0 || pointx > 7) return false;
    if(pointy < 0 || pointy > 7) return false;
    updating = true;
    var chess_board = gamestate.chess_board;
	var moveO = chess_board[pointy][pointx+1], moveR = chess_board[pointy+1][pointx+1], moveD = chess_board[pointy][pointx], moveRD = chess_board[pointy+1][pointx];
	chess_board[pointy][pointx] = moveO;
	chess_board[pointy+1][pointx] = moveD;
	chess_board[pointy][pointx+1] = moveR;
	chess_board[pointy+1][pointx+1] = moveRD;
    updateGameBoard();
    setTimeout(check_dissolve, 500, chess_board, () => {
        attack_exec(gamestate, dissolve_value);
        gamestate.now_player ^= 1;
        updateGameBoard();
        if(gamestate.player[0].HP <= 0) setTimeout(callback , 800, 1);
        if(gamestate.player[1].HP <= 0) setTimeout(callback , 800, 0);
        if(gamestate.player[0].HP > 0 && gamestate.player[1].HP > 0) updating = false;
    });
}

function attack_exec(gamestate, dissolve_value) {
    var player = gamestate.player;
    var now_player = gamestate.now_player;
    dissolve_value.HP_increase = Math.min(dissolve_value.HP_increase, player[now_player].HP_limit - player[now_player].HP); //new bz of HP limit
    //cout << "Attack increase: " << dissolve_value.attack_increase << "\tDefence increase: "<< dissolve_value.defence_increase << "\tHP_increase: " << dissolve_value.HP_increase << "\tTotal Damage: " << round(1000.0 / (player[(now_player-1)*-1].defence + 1000.0 ) * player[now_player].attack * dissolve_value.attack_times) << endl << endl; //new!
    player[now_player].attack = Math.trunc(player[now_player].attack + dissolve_value.attack_increase);
    player[now_player].defence = Math.trunc(player[now_player].defence + dissolve_value.defence_increase);
    player[now_player].HP = Math.trunc(player[now_player].HP + dissolve_value.HP_increase);
    var damage = player[(now_player-1)*-1].HP - Math.trunc(player[(now_player-1)*-1].HP - 1000.0 / (player[(now_player-1)*-1].defence + 1000.0 ) * player[now_player].attack * dissolve_value.attack_times);
    player[(now_player-1)*-1].HP = Math.trunc(player[(now_player-1)*-1].HP - 1000.0 / (player[(now_player-1)*-1].defence + 1000.0 ) * player[now_player].attack * dissolve_value.attack_times);
    updateGameStats(damage);
}