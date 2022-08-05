
import { all_pieces, black_pieces, white_pieces, white_king, black_king, board_array } from './piece_class.js'
import { game_board } from './board_class.js'

export function check_for_check(player, previous_piece_moved){
    if (player == 'white'){
        var king = white_king
        var check_value = 101
        var opp_pieces = black_pieces
    }
    if (player == 'black'){
        var king = black_king
        var check_value = 117
        var opp_pieces = white_pieces
    }

    var in_check = false
    opp_pieces.forEach(opp_piece => {
        if (opp_piece.alive == true){
            game_board.clear_array()
            opp_piece.move(previous_piece_moved)
            if (board_array[king.y][king.x] == check_value){
                in_check = true
            }
        }
    })

    return in_check
}


export function get_legal_moves(player, previous_piece_moved){
    //console.log(`checking if ${player} has any legal moves...`)
    if (player == 'white'){
        var king = white_king
        var check_value = 101
        var own_pieces = white_pieces
        var opp_pieces = black_pieces
        var castle_value = 201
        if (game_board.orientation == 'white'){
            var castle_row = 7
        }
        if (game_board.orientation == 'black'){
            var castle_row = 0
        }
        
    }
    if (player == 'black'){
        var king = black_king
        var check_value = 117
        var own_pieces = black_pieces
        var opp_pieces = white_pieces
        var castle_value = 217
        if (game_board.orientation == 'white'){
            var castle_row = 0
        }
        if (game_board.orientation == 'black'){
            var castle_row = 7
        }
    }

    var legal_moves = []

    own_pieces.forEach(own_piece => {
        if (own_piece.alive == true){

            var saved_x = own_piece.x
            var saved_y = own_piece.y
            
            game_board.clear_array()
            own_piece.move(previous_piece_moved)

            for (let row=0; row<8; row++){
                for (let col=0; col<8; col++){

                    var taken_piece = null
                    var legal_move = true

                    if (board_array[row][col] == -1 || (board_array[row][col] > 100 && board_array[row][col] < 200)){
                        own_piece.y = row
                        own_piece.x = col

                        if (board_array[row][col] > 100){
                            all_pieces.forEach(item => {
                                if (item.alive == true && item.identifier == board_array[row][col] - 100){
                                    item.alive = false
                                    taken_piece = item
                                }
                            })
                        }

                        opp_pieces.forEach(opp_piece => {
                            if (opp_piece.alive == true){
                                game_board.clear_array()
                                opp_piece.move(previous_piece_moved)
                                if (board_array[king.y][king.x] == check_value){
                                    legal_move = false
                                }
                            }
                        })

                        own_piece.x = saved_x
                        own_piece.y = saved_y
                        if (taken_piece != null){
                            taken_piece.alive = true
                        }

                        game_board.clear_array()
                        own_piece.move(previous_piece_moved)

                        if (legal_move == true){
                            legal_moves.push(own_piece)
                            legal_moves.push(row)
                            legal_moves.push(col)
                            legal_moves.push(taken_piece)
                        }
                    }

                    if (board_array[row][col] == castle_value){

                        if (king.first_turn == true){

                            var castle_col = null
                            var in_check = check_for_check(player, previous_piece_moved)

                            if (in_check == false){ // only legal to castle if not in check.
                                var blocked = false

                                var increment = 0
                                if (game_board.orientation == 'black'){
                                    increment = -1
                                }

                                if (own_piece.x == 0){
                                    castle_col = 3 + increment
                                    opp_pieces.forEach(opp_piece => {
                                        if (opp_piece.alive == true){
                                            game_board.clear_array()
                                            opp_piece.move(previous_piece_moved)
                                            if (board_array[castle_row][2 + increment] != 0 || board_array[castle_row][3 + increment] != 0){
                                                blocked = true
                                            }
                                        }
                                        
                                    })
                                }

                                if (own_piece.x == 7){
                                    castle_col = 5 + increment
                                    opp_pieces.forEach(opp_piece => {
                                        if (opp_piece.alive == true){
                                            game_board.clear_array()
                                            opp_piece.move(previous_piece_moved)
                                            if (board_array[castle_row][5 + increment] != 0 || board_array[castle_row][6 + increment] != 0){
                                                blocked = true
                                            }
                                        }
                                        
                                    })
                                }
    
                                if (blocked == false){ //castling is possible!
                                    console.log(`castling is possible for ${player}!!`)
                                    legal_moves.push(own_piece) // castle
                                    legal_moves.push(castle_row)
                                    legal_moves.push(castle_col)
                                    legal_moves.push(king) // king is never taken, so good to have this as the taken value.
                                }                                
                            }

                            game_board.clear_array()
                            own_piece.move(previous_piece_moved)
                        }
                    }
                }
            }
        }

        
    })
    return legal_moves
}


export function generate_random_legal_move(moves){

    // moves = [oriringal piece, moving to x, moving to y, taken piece]

    var no_moves = (moves.length / 4)
    var x = Math.floor(Math.random() * no_moves)

    var move = [moves[x * 4], moves[(x * 4) + 1], moves[(x * 4) + 2], moves[(x * 4) + 3], moves[x * 4].x, moves[x * 4].y]

    return move
}


export function play_move(move){

    // move = [original piece, moving to y, moving to x, taken piece, moving from x, moving from y]
    // IF CASTLING: move = [castle, castle to x, castle to y, king, castle from x, castle from y]

    if (move[3] != null){
        if (move[3].identifier == 1 || move[3].identifier == 17){ // taken piece is king, this only happens during castling.

            // move the castle.
            move[0].x = move[2]
            move[0].first_turn = false

            // move the king
            move[3].first_turn = false
            var increment = 0
            if (game_board.orientation == 'black'){
                increment = -1
            }
            if (move[2] == 3 + increment){
                move[3].x = 2 + increment
            }
            if (move[2] == 5 + increment){
                move[3].x = 6 + increment
            }

            console.log(`castle x: ${move[0].x}`)
            console.log(`king x: ${move[3].x}`)
        }
        else{
            move[0].y = move[1]
            move[0].x = move[2]
            move[0].first_turn = false
            if (move[0].type == 'pawn'){
                move[0].check_queening()
            }
            if (move[3] != null){
                move[3].alive = false
            }
        }
    }

    else{
        move[0].y = move[1]
        move[0].x = move[2]
        move[0].first_turn = false
        if (move[0].type == 'pawn'){
            move[0].check_queening()
        }
        if (move[3] != null){
            move[3].alive = false
        }
    }
    
    
    
}