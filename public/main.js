var cur = 0;
var people = "X";

function start() {
    for(var i = 1; i <= 3; ++i) {
        for(var j = 1; j <= 3; ++j) {
            $('#' + i + "_" + j).text("");
        }
    }
    cur = 0;
    if(Math.random() < 0.5) {
        $('#message').text("您是先手");
        people = "X";
    }
    else {
        $('#message').text("您是后手");
        people = "O";
        move();
    }
}

function get_map() {
    var array = new Array(4);
    for(var i = 1; i <= 3; ++i) {
        array[i] = new Array();
        array[i].push(0);
        for(var j = 1; j <= 3; ++j) {
            var tmp = $('#' + i + "_" + j).text();
            array[i].push(tmp);
        }
    }
    return array;
}

function show(element) {
    if($("#message").text() == "" || $(element).text() != "" || check()) return;
    $(element).text((cur ? "O" : "X"));
    cur ^= 1;
    var final = check();
    if(final == "X") {
        setTimeout(function() {
            alert("先手胜利！");
        }, 100);
        return;
    }
    else if(final == "O") {
        setTimeout(function() {
            alert("后手胜利！");
        }, 100);
        return;
    }
    else if(final == "Q") {
        setTimeout(function() {
            alert("平局！");
        }, 100);
        return;
    }
    if(cur != (people == "X" ? 0 : 1)) move();
}

function check(Map) {
    if(Map == null) Map = get_map();
    for(var i = 1; i <= 3; ++i) {
        if(Map[i][1] != "" && Map[i][1] == Map[i][2] && Map[i][2] == Map[i][3]) return Map[i][1];
        if(Map[1][i] != "" && Map[1][i] == Map[2][i] && Map[2][i] == Map[3][i]) return Map[1][i];
    }
    if(Map[1][1] != "" && Map[1][1] == Map[2][2] && Map[2][2] == Map[3][3]) return Map[1][1];
    if(Map[1][3] != "" && Map[1][3] == Map[2][2] && Map[2][2] == Map[3][1]) return Map[1][3];
    for(var i = 1; i <= 3; ++i) {
        for(var j = 1; j <= 3; ++j) {
            if(Map[i][j] == "") {
                return "";
            }
        }
    }
    return "Q";
}

function alpha_beta(Map, now, next, alpha, beta) {
    var final = check(Map);
    if(final == people) return -1;
    if(final == "Q") return 0;
    if(final != "") return 1;
    for(var i = 1; i <= 3; ++i) {
        for(var j = 1; j <= 3; ++j) {
            if(Map[i][j] == "") {
                Map[i][j] = now;
                var tmp = alpha_beta(Map, next, now, alpha, beta);
                Map[i][j] = "";
                if(now != people) {
                    if(tmp > alpha) alpha = tmp;
                    if(alpha >= beta) return beta;
                }
                else {
                    if(tmp < beta) beta = tmp;
                    if(beta <= alpha) return alpha;
                }
            }
        }
    }
    return now != people ? alpha : beta;
}

function move() {
    var Map = get_map();
    var best = -2;
    var moves = [];
    for(var i = 1; i <= 3; ++i) {
        for(var j = 1; j <= 3; ++j) {
            if(Map[i][j] == "") {
                Map[i][j] = (people == "X" ? "O" : "X");
                var tmp = alpha_beta(Map, people, Map[i][j], -2, 2);
                Map[i][j] = "";
                if(tmp > best) {
                    best = tmp;
                    moves = [[i, j]];
                }
                else if(tmp == best) {
                    moves.push([i, j]);
                }
            }
        }
    }
    var index = Math.floor(Math.random() * moves.length);
    show("#" + moves[index][0] + "_" + moves[index][1]);
}
