var board = new Array();
var score =0;
var hasConflicted = new Array();
//用于判断每个小格子是否发生了变化
//游戏初始化---------------------------------
$(document).ready(function(){
    prepareForMobile();
    newgame();
});
function prepareForMobile() {
    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid-container').css('padding',cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth)

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);

    
}
function newgame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();

}
function init() {
    for (var i=0; i<4;i++)
        for (var j=0;j<4;j++){
            var gridCell=$('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
            //每个方格的位置由这两个函数决定，在support2048中
        }

    for(var i = 0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]= false;
        }
    }
    updateBoardView();
    score = 0;
}
function  updateBoardView(){
    $(".number-cell").remove();
    // 删除当前所有方格中的值
    for (var i=0;i<4;i++)
        for (var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if (board[i][j]==0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i, j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i, j)+cellSideLength/2);
            }else{
                // 不为零时用number-cell代替gridcell
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i, j));
                theNumberCell.css('left',getPosLeft(i, j));
                theNumberCell.css('background-color',getNumberBackgroudColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                // 背景色和前景色
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j]= false;
        }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');

}
function generateOneNumber(){//先随机找一个位置，再在这个位置上赋值
    if (nospace(board))
        return false;
    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
      //产生0-4直接的浮点数，floor向下取整0123,parseInt强制类型转换为int
    var time=0;

    while(time<30){ //===========================================================不懂
        if (board[randx][randy]==0)
            break;
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        time++;
    }
    if(time>30){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++)
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
    }
    //随机一个数字2,4
    var randNumber = Math.random() <0.5? 2:4;//随机数小于0.5为2，大于0.5为4

    //显示
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx, randy, randNumber);
    return true;
}
$(document).keydown(function (event) {
    event.preventDefault();//阻挡按键本来会产生的效果，这里防止屏幕滚动条上下移动
    switch (event.keyCode) {
        case 37: //left,向左移动，生成新的数，判断游戏是否结束
            if (moveLeft()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
                //设置延时，让alert有出现 的效果
            }
            break;
        case 38://up
            if (moveUp()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
            break;
        case 39://right
            if (moveRight()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
            break;
        case 40://down
            if (moveDown()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
            break;
        default:
            break;

    }
})
document.addEventListener('touchstart',function (event) {
    startx=event.touches[0].pageX;//event.touches获取多个手指触碰屏幕的信息【0】为一个手指
    starty=event.touches[0].pageY;
});
document.addEventListener('touchmove',function (event) {
    event.preventDefault();
});
document.addEventListener('touchend',function (event) {
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(deltax)<0.3*documentWidth && Math.abs(deltay)<0.3*documentWidth)
        return;
    //x
    if(Math.abs(deltax)>=Math.abs(deltay)){
        if(deltax>0){
            //向右
            if (moveRight()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
        }else{
            //向左
            if (moveLeft()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
                //设置延时，让alert有出现 的效果
            }
        }

    }
    else{
        //y
        if(deltay>0){
            //向下
            if (moveDown()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
        }else{
            //向上
            if (moveUp()){
                setTimeout("generateOneNumber()",200);
                setTimeout("isgameover();",200);
            }
        }
    }
});
function isgameover() {
    if (nospace(board)&&nomove(board)){
        gameover();
    }
}
function gameover() {
    alert('Game Over');
}
//--------------------------------------------------------Left-------------------------------------
function moveLeft() {
    if (!canMoveLeft(board)){
        return false;
    }
    //moveLeft
    for (var i=0;i<4;i++)
        for (var j=1;j<4;j++){
            if (board[i][j]!=0){//不为0可以向左移动，移动要判断该行左侧是否空（或相等）且没有障碍物
                for (var k=0;k<j;k++){
                    if (board[i][k]==0&&noBlockHorizontal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j,i, k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if (board[i][k]==board[i][j] &&noBlockHorizontal(i, k, j, board)&& !hasConflicted[i][k]){
                    // else if (board[i][k]==board[i][j] &&noBlockHorizontal(i, k, j, board)){
                        //hasConflicted[i][k]没变化过，即没有发生add
                        //move
                        showMoveAnimation(i, j,i, k);
                        //add
                        board[i][k] +=board[i][j];
                        board[i][j]=0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;//只add一次
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);//设置更新在200ms后发生，move动画就可以显示
    return true;
}
//--------------------------------------------------------Right-------------------------------------

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board )&& !hasConflicted[i][k] ){
                    // else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board )){
                        showMoveAnimation( i , j , i , k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}
function moveUp() {
    if (!canMoveUp(board)){
        return false;
    }
    //
    for(var j=0;j<4;j++)
        for (var i=1;i<4;i++)
            if (board[i][j]!=0)
                for (var k=0;k<i;k++)
                    if (board[k][j]==0 && noBlockupdown(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    // else if (board[k][j]==board[i][j]&&noBlockupdown(j, k, i, board)&& !hasConflicted[k][j]) {
                    else if (board[k][j]==board[i][j]&&noBlockupdown(j, k, i, board)) {
                        //move
                        showMoveAnimation(i,j, k, j);

                        //add
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        // hasConflicted[k][j]=true;

                        continue;
                    }
    setTimeout("updateBoardView()",200);
    return true;
}
function moveDown() {
    if (!canMoveDown(board)){
        return false;
    }
    //
    for (var j=0;j<4;j++)
        for (var i=2;i>=0;i--)
            if(board[i][j]!=0){
                for (var k=3;k>i;k--)
                    if (board[k][j]==0&&noBlockupdown(j, i, k, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                    }
                    // else if (board[i][j]==board[k][j]&&noBlockupdown(j, i, k, board) && !hasConflicted[k][j]){
                    else if (board[i][j]==board[k][j]&&noBlockupdown(j, i, k, board)){
                        //move,add
                        showMoveAnimation(i, j, k, j)
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        score+=board[k][j];
                        updateScore(score);
                        // hasConflicted[k][j]=true;

                    }
            }
    setTimeout("updateBoardView()",200);
    return true;

}