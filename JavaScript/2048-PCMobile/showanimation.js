function showNumberWithAnimation(i, j, randNumber) {
    var numberCell=$('#number-cell-'+i+"-"+j);

    numberCell.css('background-color', getNumberBackgroudColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        // animate函数是jQUERY中的动画函数,动画渐变50ms
        width:cellSideLength,
        height:cellSideLength,
        top:getPosTop(i, j),
        left:getPosLeft(i, j)
    },50);
}
function showMoveAnimation(fromx, fromy,tox, toy){
    var numberCell = $('#number-cell-'+fromx+'-'+fromy);
    numberCell.animate({
        top:getPosTop(tox, toy),
        left:getPosLeft(tox, toy)

    },200);
}
function updateScore(score) {
    $('#score').text(score);

}