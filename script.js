
import { board_array, white_king, black_king, white_pieces, black_pieces, all_pieces} from './piece_class.js'
import { game_board } from './board_class.js'
import { get_legal_moves, check_for_check, generate_random_legal_move, play_move, computer_program_turn, computer_engine } from './game.js'

const board = document.getElementById('board')

var turn = 'white'
var last_clicked_id = null

var white_player = 'computer'
var black_player = 'computer'
var end_game = true
var previoustime = 0
var result = null
var menu_down = false
var computer_type = 'program'
var navigating = false
var pause = false
var previous_piece_moved = null

function arrows(){
    const end_screen = document.getElementById('end_screen')
    if (end_screen != null){
        end_screen.remove()
    }
    const menu_screen = document.getElementById('drop_down')
    if (menu_screen != null){
        menu_screen.remove()
        menu_down = false
    }
    if (game_board.move == 0){
        navigating = false
    }
    if (game_board.move > 0){
        navigating = true
    }
}

function handle_start_arrow(){
    if (game_board.no_of_plys > 0){
        game_board.change_move(game_board.no_of_plys - 1)
        arrows()
    }
}

function handle_end_arrow(){
    if (game_board.no_of_plys > 0){
        game_board.change_move(0)
        arrows()
    }
    
}

function handle_back_arrow(){
    if (game_board.no_of_plys - 1 > game_board.move){
        game_board.change_move(game_board.move + 1)
        arrows()
    }
}

function handle_forward_arrow(){
    if (game_board.move > 0){
        game_board.change_move(game_board.move - 1)
        arrows()
    }
}

function handle_pause_game(event){
    const pause_button = document.getElementById('pause_button')
    if (pause == false){
        pause = true
        pause_button.innerHTML = 'Resume'
    }
    else if (pause == true){
        pause = false
        pause_button.innerHTML = 'Pause'
    }
}

function handle_abort_game(){
    handle_close_option_screen()
    result = 'game aborted'
    end_game = true
    game_finished(result)
}

function handle_close_end_screen(){
    const end_screen = document.getElementById('end_screen')
    end_screen.remove()
}

function handle_close_option_screen(){
    const drop_down = document.getElementById('drop_down')
    drop_down.remove()
    menu_down = false
} 

function handle_menu(event){

    const menu_button = event.target

    if (menu_down == true){
        handle_close_option_screen()
    }

    else if (menu_down == false){

        const drop_down = document.createElement('div')
        drop_down.setAttribute('id', 'drop_down')
        drop_down.classList.add('drop_down')
        drop_down.style.gridColumnStart = 3
        drop_down.style.gridColumnEnd = 7
        drop_down.style.gridRowStart = 2
        drop_down.style.gridRowEnd = 7
        board.appendChild(drop_down)

        const close_container = document.createElement('div')
        close_container.classList.add('close_container')
        drop_down.appendChild(close_container)

        const close_button = document.createElement('img')
        close_button.setAttribute('id', 'close_option_screen')
        close_button.src = 'images/buttons/cross.png'
        close_button.classList.add('close_end_screen')
        close_container.appendChild(close_button)
        close_button.addEventListener('click', handle_close_option_screen, {once: true})

        const button_container = document.createElement('div')
        button_container.classList.add('drop_down_container')
        drop_down.appendChild(button_container)

        const abort_button = document.createElement('div')
        abort_button.setAttribute('id', 'abort_button')
        abort_button.classList.add('drop_down_button')
        if (end_game == false){
            abort_button.innerHTML = 'Abort game'
        }
        if (end_game == true){
            abort_button.innerHTML = 'New game'
        }
        
        button_container.appendChild(abort_button)
        abort_button.addEventListener('click', handle_abort_game, {once: true})

        const pause_button = document.createElement('div')
        pause_button.setAttribute('id', 'pause_button')
        pause_button.classList.add('drop_down_button')
        if (pause == false){
            pause_button.innerHTML = 'Pause'
        }
        if (pause == true){
            pause_button.innerHTML = 'Resume'
        }
        button_container.appendChild(pause_button)
        pause_button.addEventListener('click', handle_pause_game)


        menu_down = true
    }

    

    
}

function handle_flip(){
    if (end_game == false){
        game_board.flip_board()
    }
    
}

function handle_black_computer(event){

    const clicked = event.target
    const play_button = document.getElementById('play_button')

    var delay = false
    if (black_player == null){
        black_player = 'computer'
        clicked.classList.add('selected')
        delay = true
    }

    if (black_player == 'computer' && delay == false){
        black_player = null
        clicked.classList.remove('selected')
    }

    if (black_player == 'human'){
        const black_human = document.getElementById('black_human')
        black_player = 'computer'
        clicked.classList.add('selected')
        black_human.classList.remove('selected')
    }
    
    if (white_player == null || black_player == null){
        play_button.classList.remove('play_again')
        play_button.classList.add('reject_play')
    }
    else{
        play_button.classList.remove('reject_play')
        play_button.classList.add('play_again')
    }
}

function handle_black_human(event){

    const clicked = event.target
    const play_button = document.getElementById('play_button')

    var delay = false
    if (black_player == null){
        black_player = 'human'
        clicked.classList.add('selected')
        delay = true
    }
    if (black_player == 'human' && delay == false){
        black_player = null
        clicked.classList.remove('selected')
    }
    if (black_player == 'computer'){
        const black_computer = document.getElementById('black_computer')
        black_player = 'human'
        clicked.classList.add('selected')
        black_computer.classList.remove('selected')
    }

    if (white_player == null || black_player == null){
        play_button.classList.remove('play_again')
        play_button.classList.add('reject_play')
    }
    else{
        play_button.classList.remove('reject_play')
        play_button.classList.add('play_again')
    }
}

function handle_white_computer(event){

    const clicked = event.target
    const play_button = document.getElementById('play_button')

    var delay = false
    if (white_player == null){
        white_player = 'computer'
        clicked.classList.add('selected')
        delay = true
    }

    if (white_player == 'computer' && delay == false){
        white_player = null
        clicked.classList.remove('selected')
    }

    if (white_player == 'human'){
        const white_human = document.getElementById('white_human')
        white_player = 'computer'
        clicked.classList.add('selected')
        white_human.classList.remove('selected')
    }

    if (white_player == null || black_player == null){
        play_button.classList.remove('play_again')
        play_button.classList.add('reject_play')
    }
    else{
        play_button.classList.remove('reject_play')
        play_button.classList.add('play_again')
    }
}

function handle_white_human(event){

    const clicked = event.target
    const play_button = document.getElementById('play_button')

    var delay = false
    if (white_player == null){
        white_player = 'human'
        clicked.classList.add('selected')
        delay = true
    }
    if (white_player == 'human' && delay == false){
        white_player = null
        clicked.classList.remove('selected')
    }
    if (white_player == 'computer'){
        const white_computer = document.getElementById('white_computer')
        white_player = 'human'
        clicked.classList.add('selected')
        white_computer.classList.remove('selected')
    }

    if (white_player == null || black_player == null){
        play_button.classList.remove('play_again')
        play_button.classList.add('reject_play')
    }
    else{
        play_button.classList.remove('reject_play')
        play_button.classList.add('play_again')
    }
}

function handle_play(event){
    const play_button = event.target
    if (white_player == null || black_player == null){
        play_button.classList.add('reject_play')
    }
    else{
        start_game()
    }
}

function handle_play_again(event){
    const board = document.getElementById('board')
    const end_screen = document.getElementById('end_screen')
    board.removeChild(end_screen)
    initialise()

}

function game_finished(result){

    

    if (document.getElementById('end_screen') == null){

        const board = document.getElementById('board')
        const end_screen = document.createElement('div')

        end_screen.setAttribute('id', 'end_screen')
        end_screen.style.gridColumnStart = 3
        end_screen.style.gridColumnEnd = 7
        end_screen.style.gridRowStart = 2
        end_screen.style.gridRowEnd = 7
        end_screen.classList.add('end_screen')
        board.appendChild(end_screen)

        const close_container = document.createElement('div')
        close_container.classList.add('close_container')
        end_screen.appendChild(close_container)

        const close_button = document.createElement('img')
        close_button.setAttribute('id', 'close_end_screen')
        close_button.src = 'images/buttons/cross.png'
        close_button.classList.add('close_end_screen')
        close_container.appendChild(close_button)
        close_button.addEventListener('click', handle_close_end_screen, {once: true})

        const announcement = document.createElement('div')
        announcement.innerHTML = 'The game has ended!'
        announcement.classList.add('text_wrapper')
        end_screen.appendChild(announcement)

        const info = document.createElement('div')
        info.innerHTML = `${result}`
        info.classList.add('text_wrapper')
        end_screen.appendChild(info)

        const play_again = document.createElement('div')
        play_again.innerHTML = "Play again?"
        play_again.classList.add('text_wrapper')
        play_again.classList.add('play_again')
        play_again.addEventListener('click', handle_play_again, {once: true})
        end_screen.appendChild(play_again)
    }

    
}

function computer_turn(computer_type, moves){
    if (computer_type == 'random'){
        var move = generate_random_legal_move(moves)
    }
    if (computer_type == 'program'){
        var move = computer_engine.computer_program_turn(turn, previous_piece_moved)
    }
    play_move(move)
    game_board.clear_array()
    game_board.remove_traking_squares()
    var taking = null
    var castling = false
    if (move[3] == null){
        taking = false
    }
    if (move[3] != null){
        if (move[3].type == 'king'){
            taking = false
            castling = true
        }
        else{
            taking = true
        }
    }
    var increment = 0
    if (game_board.orientation == 'black'){
        increment = -1
    }
    if (castling == true){
        game_board.draw_pieces(4 + increment, move[3].y,  move[3].x, move[3].y, false)
        game_board.update_sequence(4 + increment, move[3].y,  move[3].x, move[3].y, false)
    }
    if (castling == false){
        game_board.draw_pieces(move[4], move[5], move[2], move[1], taking)
        game_board.update_sequence(move[4], move[5], move[2], move[1], taking)
    }

    previous_piece_moved = move[0]
    
    game_board.draw_taken_pieces()
    if (turn == 'white'){
        turn = 'black'
    }
    else if (turn == 'black'){
        turn = 'white'
    }

}

function check_game_finished(moves, in_check){

    

    if (moves.length == 0 && in_check == true){
        console.log(`${turn} is in checkmate!!`)
        if (turn == 'white'){
            result = 'black won by checkmate!'
        }
        if (turn == 'black'){
            result = 'white won by checkmate!'
        }
        end_game = true
    }

    if (moves.length == 0 && in_check == false){
        console.log(`stalemate! ${turn} cannot move`)
        result = 'stalemate'
        end_game = true
    }

    var count = 0
    all_pieces.forEach(item => {
        if (item.alive == true){
            count += 1
        }
    })
    if (count == 2){
        console.log('stalemate! Only two kings.')
        result = 'stalemate'
        end_game = true
    }

}

function handleloop(currentTime){

    var requestid = window.requestAnimationFrame(handleloop)
    var time_elapsed = (currentTime - previoustime) / 1000

    if (time_elapsed >= (1 / 5000)){

        var moves = get_legal_moves(turn, previous_piece_moved)
        var in_check = check_for_check(turn, previous_piece_moved)
        check_game_finished(moves, in_check)

        if (end_game == false && menu_down == false && navigating == false && pause == false){
            computer_turn(computer_type, moves)
        }

        else if (end_game == true){
            window.cancelAnimationFrame(requestid)
            game_finished(result)
        }

        previoustime = currentTime
    }
}

function handleclick(event){
    const piece = event.target
    if ((white_player == 'human' || black_player == 'human') && end_game == false){
        
        if (turn == 'white'){
            var own_pieces = white_pieces
            var opp_pieces = black_pieces
            var own_upper_bound = 16
            var own_lower_bound = 1
            var opp_upper_bound = 32
            var opp_lower_bound = 17
            var opp_take_upper_bound = 132
            var opp_take_lower_bound = 117
            var next_turn = 'black'
            var castleable = 201
        }

        if (turn == 'black'){
            var own_pieces = black_pieces
            var opp_pieces = white_pieces
            var own_upper_bound = 32
            var own_lower_bound = 17
            var opp_upper_bound = 16
            var opp_lower_bound = 1
            var opp_take_upper_bound = 116
            var opp_take_lower_bound = 101
            var next_turn = 'white'
            var castleable = 217
        }

        if (end_game == false && menu_down == false && game_board.move == 0){

            if (piece.classList.contains('piece')){
                if (piece.id <= own_upper_bound && piece.id >= own_lower_bound){ //selecting own pieces
                    own_pieces.forEach(own_piece => {
                        if (piece.id == own_piece.identifier && piece.id == last_clicked_id && own_piece.alive == true){
                            game_board.remove_options()
                            game_board.clear_array()
                            game_board.draw_pieces()
                            last_clicked_id = null
                        }
                        else if (piece.id == own_piece.identifier){

                            if (board_array[own_piece.y][own_piece.x] == castleable){

                                var in_check = check_for_check(turn, previous_piece_moved)
                                var blocked = false

                                if (in_check == false){

                                    var increment = 0
                                    
                                    if (game_board.orientation == 'black'){
                                        increment = -1
                                    }
                                    console.log(increment)
                                    var castle_piece = null
                                    own_pieces.forEach(castle => {

                                        if (castle.identifier == last_clicked_id){
                                            castle_piece = castle
                                            
                                            if (own_piece.first_turn == false || castle.first_turn == false){
                                                blocked = true
                                            }

                                            
                                            if (castle.x == 0){
                                                opp_pieces.forEach(opp_piece => {
                                                    if (opp_piece.alive == true){
                                                        game_board.clear_array()
                                                        opp_piece.move(previous_piece_moved)
                                                        if (board_array[castle.y][2 + increment] != 0 || board_array[castle.y][3 + increment] != 0){
                                                            blocked = true
                                                            console.log('its fucking blocked for x = 0')
                                                            console.log(board_array[castle.y][2 + increment], board_array[castle.y][3 + increment])
                                                        }
                                                    }
                                                    
                                                })
                                                
                                            }
                                            if (castle.x == 7){
                                                
                                                opp_pieces.forEach(opp_piece => {
                                                    if (opp_piece.alive == true){
                                                        game_board.clear_array()
                                                        opp_piece.move(previous_piece_moved)
                                                        if (board_array[castle.y][5 + increment] != 0 || board_array[castle.y][6 + increment] != 0){
                                                            blocked = true
                                                            console.log('its fucking blocked')
                                                            console.log(board_array[castle.y][5 + increment], board_array[castle.y][6 + increment])
                                                        }
                                                    }
                                                    
                                                })
                                                
                                            }
                                            
                                        }
                                    })

                                    console.log(blocked)

                                    if (blocked == false){
                                        if (castle_piece.x == 0){
                                            castle_piece.x = 3 + increment
                                            own_piece.x = 2 + increment
                                        }
                                        if (castle_piece.x == 7){
                                            castle_piece.x = 5 + increment
                                            own_piece.x = 6 + increment
                                        }
                                        castle_piece.first_turn = false
                                        own_piece.first_turn = false
                                        
                                        
                                        game_board.remove_options()
                                        game_board.remove_traking_squares()
                                        game_board.clear_array()
                                        game_board.draw_pieces(4 + increment, own_piece.y, own_piece.x, own_piece.y, false)
                                        game_board.update_sequence(4 + increment, own_piece.y, own_piece.x, own_piece.y, false)
                                        last_clicked_id = null
                                        previous_piece_moved = own_piece

                                        turn = next_turn
                                        var moves = get_legal_moves(turn, previous_piece_moved)
                                        var in_check = check_for_check(turn, previous_piece_moved)
                                        check_game_finished(moves, in_check)

                                        if (end_game == true){
                                            game_finished(result)
                                        }
                                    }
                                    game_board.clear_array() // is this necessary?

                                    

                                    if (((turn == 'white' && white_player == 'computer') || (turn == 'black' && black_player == 'computer')) && end_game == false && blocked == false){
                                        computer_turn(computer_type, moves)
                                        
                                        var moves = get_legal_moves(turn, previous_piece_moved)
                                        var in_check = check_for_check(turn, previous_piece_moved)
                                        check_game_finished(moves, in_check)

                                        if (end_game == true){
                                            game_finished(result)
                                        }
                                    }
                                }

                                console.log(`${blocked} down here`)

                                if (in_check == true || blocked == true){
                                    game_board.remove_options()
                                    game_board.clear_array()
                                    game_board.draw_pieces()
                                    own_piece.move(previous_piece_moved) // without image changing; just the array is updated
                                    game_board.check_for_check_draw(own_piece, turn, previous_piece_moved)
                                    // simulate all the moves defined in the array, and check if they are legal.
                                    last_clicked_id = piece.id
                                }
                                
                            }

                            else{
                                game_board.remove_options()
                                game_board.clear_array()
                                game_board.draw_pieces()
                                own_piece.move(previous_piece_moved) // without image changing; just the array is updated
                                game_board.check_for_check_draw(own_piece, turn, previous_piece_moved)
                                // simulate all the moves defined in the array, and check if they are legal.
                                last_clicked_id = piece.id
                            }
                        }
                    })
                }

                else if (piece.id >= opp_lower_bound && piece.id <= opp_upper_bound){ // selecting opposition piece
                    if (board_array[piece.style.gridRowStart - 1][piece.style.gridColumnStart - 1] >= opp_take_lower_bound && board_array[piece.style.gridRowStart - 1][piece.style.gridColumnStart - 1] <= opp_take_upper_bound){
                        //console.log('selecting opposition piece')
                        opp_pieces.forEach(item => {
                            if (item.alive == true && item.y == piece.style.gridRowStart - 1 && item.x == piece.style.gridColumnStart - 1){

                                var taken_x = item.x
                                var taken_y = item.y
                                var original_x = null
                                var original_y = null

                                item.alive = false
                                own_pieces.forEach(own_piece => {
                                    if (own_piece.identifier == last_clicked_id){

                                        original_x = own_piece.x
                                        original_y = own_piece.y

                                        own_piece.x = item.x
                                        own_piece.y = item.y
                                        own_piece.first_turn = false
                                        previous_piece_moved = own_piece
                                        if (own_piece.type == 'pawn'){
                                            own_piece.check_queening()
                                        }
                                    }
                                })
                                game_board.remove_options()
                                game_board.remove_traking_squares()
                                game_board.clear_array()
                                game_board.draw_pieces(original_x, original_y, taken_x, taken_y, true)
                                game_board.update_sequence(original_x, original_y, taken_x, taken_y, true)
                                game_board.draw_taken_pieces()
                                
                                last_clicked_id = null
                                
                                turn = next_turn

                                //console.log("\n\n")
                                var moves = get_legal_moves(turn, previous_piece_moved)
                                var in_check = check_for_check(turn, previous_piece_moved)

                                check_game_finished(moves, in_check)
                                //console.log(moves)
                                //console.log(in_check)

                                if (end_game == true){
                                    game_finished(result)
                                }

                                else if (((turn == 'white' && white_player == 'computer') || (turn == 'black' && black_player == 'computer')) && end_game == false){
                                    
                                    computer_turn(computer_type, moves)
                                        
                                    var moves = get_legal_moves(turn, previous_piece_moved)
                                    var in_check = check_for_check(turn, previous_piece_moved)
                                    check_game_finished(moves, in_check)

                                    if (end_game == true){
                                        game_finished(result)
                                    }
                                }
                                
                            }
                        })

                        
                    }

                    

                    else{
                        game_board.remove_options()
                        game_board.clear_array()
                        last_clicked_id = null
                    }
                } 
            }

            else if (piece.classList.contains('optional')){
                // moving own piece to optional square
                var original_x = null
                var original_y = null
                own_pieces.forEach(item => {
                    if (item.identifier == last_clicked_id){
                        original_x = item.x
                        original_y = item.y
                        item.x = piece.style.gridColumnStart - 1
                        item.y = piece.style.gridRowStart - 1
                        item.first_turn = false
                        previous_piece_moved = item
                        if (item.type == 'pawn'){
                            item.check_queening()
                        }
                    }
                })
                turn = next_turn
                game_board.remove_options()
                game_board.remove_traking_squares()
                game_board.clear_array()
                game_board.draw_pieces(original_x, original_y, piece.style.gridColumnStart - 1, piece.style.gridRowStart - 1, false)
                game_board.update_sequence(original_x, original_y, piece.style.gridColumnStart - 1, piece.style.gridRowStart - 1, false)
                last_clicked_id = null

                var moves = get_legal_moves(turn, previous_piece_moved)
                var in_check = check_for_check(turn, previous_piece_moved)
                check_game_finished(moves, in_check)

                if (end_game == true){
                    game_finished(result)
                }

                else if (((turn == 'white' && white_player == 'computer') || (turn == 'black' && black_player == 'computer')) && end_game == false){
                    console.log(computer_type)
                    console.log(moves)
                    computer_turn(computer_type, moves)

                    var moves = get_legal_moves(turn, previous_piece_moved)
                    var in_check = check_for_check(turn, previous_piece_moved)
                    check_game_finished(moves, in_check)

                    if (end_game == true){
                        game_finished(result)
                    }
                }
            }

            else if (piece.classList.contains('takeable')){ // selecting an en passant option.
                console.log("selecting en passant option")

                var own_piece = null
                var opp_piece = null

                var taken_x = null
                var taken_y = null
                var original_x = null
                var original_y = null

                own_pieces.forEach(own_piece => {
                    if (own_piece.identifier == last_clicked_id){
                        original_x = own_piece.x
                        original_y = own_piece.y

                        own_piece.x = piece.style.gridColumnStart - 1
                        own_piece.y = piece.style.gridRowStart - 1
                        own_piece.first_turn = false
                        previous_piece_moved = own_piece
                        if (own_piece.type == 'pawn'){
                            own_piece.check_queening()
                        }
                    }
                })

                if ((turn == 'white' && game_board.orientation == 'white') || (turn == 'black' && game_board.orientation == 'black')){
                    var i = 1
                }

                if ((turn == "black" && game_board.orientation == 'white') || (turn == 'white' && game_board.orientation == 'black')){
                    var i = -1
                }  

                var col = piece.style.gridColumnStart - 1
                var row = piece.style.gridRowStart - 1 // the taken piece is + 1 (if going up); the taken piece is -1 (if going down)
                console.log(row, col)

                opp_pieces.forEach(opp_piece => {
                    if (opp_piece.alive == true && opp_piece.x == col && opp_piece.y == row + i){
                        console.log(opp_piece.identifier)
                        opp_piece.alive = false
                        taken_x = opp_piece.x
                        taken_y = opp_piece.y - i
                        console.log(taken_y, taken_x)
                    }
                })
                
                game_board.remove_options()
                game_board.remove_traking_squares()
                game_board.clear_array()
                game_board.draw_pieces(original_x, original_y, taken_x, taken_y, true)
                game_board.update_sequence(original_x, original_y, taken_x, taken_y, true)
                game_board.draw_taken_pieces()
                
                last_clicked_id = null
                
                turn = next_turn

                //console.log("\n\n")
                var moves = get_legal_moves(turn, previous_piece_moved)
                var in_check = check_for_check(turn, previous_piece_moved)

                check_game_finished(moves, in_check)
                //console.log(moves)
                //console.log(in_check)

                if (end_game == true){
                    game_finished(result)
                }

                else if (((turn == 'white' && white_player == 'computer') || (turn == 'black' && black_player == 'computer')) && end_game == false){
                    console.log(computer_type)
                    console.log(moves)
                    computer_turn(computer_type, moves)

                    var moves = get_legal_moves(turn, previous_piece_moved)
                    var in_check = check_for_check(turn, previous_piece_moved)
                    check_game_finished(moves, in_check)

                    if (end_game == true){
                        game_finished(result)
                    }
                }
                
            }

            else{
                game_board.remove_options()
                game_board.clear_array()
                game_board.draw_pieces()
                last_clicked_id = null
            }
        }
    }
    
}

function initialise(){
    game_board.remove_elements()
    game_board.remove_traking_squares()
    game_board.remove_taken_pieces()
    
    white_player = null
    black_player = null

    game_board.orientation = 'white'
    game_board.sequence = []
    game_board.no_of_plys = 0
    game_board.move = 0
    

    if (document.getElementById('top_take_board') == null){
        const board_wrapper = document.getElementById('board_wrapper')

        // create top and bottom board wrapper
        const top_board_wrapper = document.createElement('div')
        top_board_wrapper.classList.add('above_below_board_wrapper')
        top_board_wrapper.setAttribute('id', 'top_board_wrapper')
        board_wrapper.insertBefore(top_board_wrapper, board_wrapper.firstChild)


        const bottom_board_wrapper = document.createElement('div')
        bottom_board_wrapper.classList.add('above_below_board_wrapper')
        bottom_board_wrapper.setAttribute('id', 'bottom_board_wrapper')
        board_wrapper.appendChild(bottom_board_wrapper)

        // creating top and bottom player wrappers
        const top_player_wrapper = document.createElement('div')
        top_player_wrapper.classList.add('player_wrapper')
        top_player_wrapper.setAttribute('id', 'top_player_wrapper')
        top_board_wrapper.appendChild(top_player_wrapper)

        const bottom_player_wrapper = document.createElement('div')
        bottom_player_wrapper.classList.add('player_wrapper')
        bottom_player_wrapper.setAttribute('id', 'bottom_player_wrapper')
        bottom_board_wrapper.appendChild(bottom_player_wrapper)

        // creating top and bottom player info containers
        const top_player_info = document.createElement('div')
        top_player_info.classList.add('player_info')
        top_player_info.setAttribute('id', 'top_player_info')
        top_player_info.innerHTML = 'Opponent'
        top_player_wrapper.appendChild(top_player_info)

        const bottom_player_info = document.createElement('div')
        bottom_player_info.classList.add('player_info')
        bottom_player_info.setAttribute('id', 'bottom_player_info')
        bottom_player_info.innerHTML = 'You'
        bottom_player_wrapper.appendChild(bottom_player_info)

        // creating top and bottom takeboards
        const top_take_board = document.createElement('div')
        top_take_board.setAttribute('id', 'top_take_board')
        top_take_board.classList.add('take_board')
        top_player_wrapper.appendChild(top_take_board)

        const bottom_take_board = document.createElement('div')
        bottom_take_board.setAttribute('id', 'bottom_take_board')
        bottom_take_board.classList.add('take_board')
        bottom_player_wrapper.appendChild(bottom_take_board)

        // creating back / forward arrows to go in the bottom board wrapper.
        const start_arrow = document.createElement('img')
        start_arrow.setAttribute('id', 'start_arrow')
        start_arrow.classList.add('board_buttons')
        start_arrow.src = 'images/buttons/start-arrow.png'
        bottom_board_wrapper.appendChild(start_arrow)
        start_arrow.addEventListener('click', handle_start_arrow)

        const left_arrow = document.createElement('img')
        left_arrow.setAttribute('id', 'left_arrow')
        left_arrow.classList.add('board_buttons')
        left_arrow.src = 'images/buttons/left-arrow.png'
        bottom_board_wrapper.appendChild(left_arrow)
        left_arrow.addEventListener('click', handle_back_arrow)

        const right_arrow = document.createElement('img')
        right_arrow.setAttribute('id', 'right_arrow')
        right_arrow.classList.add('board_buttons')
        right_arrow.src = 'images/buttons/right-arrow.png'
        bottom_board_wrapper.appendChild(right_arrow)
        right_arrow.addEventListener('click', handle_forward_arrow)

        const end_arrow = document.createElement('img')
        end_arrow.setAttribute('id', 'end_arrow')
        end_arrow.classList.add('board_buttons')
        end_arrow.src = 'images/buttons/end-arrow.png'
        bottom_board_wrapper.appendChild(end_arrow)
        end_arrow.addEventListener('click', handle_end_arrow)

        

        

        // create buttons to go in the side menu (settings and flip board) -- and a container to orgaise them horizontally
        const menu_collection = document.createElement('div')
        menu_collection.classList.add('menu_collection')
        top_board_wrapper.appendChild(menu_collection)

        const menu_button = document.createElement('img')
        menu_button.setAttribute('id', 'menu_button')
        menu_button.src = 'images/buttons/settings.png'
        menu_button.classList.add('board_buttons')
        menu_collection.appendChild(menu_button)
        menu_button.addEventListener('click', handle_menu)

        const flip_button = document.createElement('img')
        flip_button.setAttribute('id', 'flip_button')
        flip_button.classList.add('board_buttons')
        flip_button.src = 'images/buttons/flip_button.png'
        menu_collection.appendChild(flip_button)
        flip_button.addEventListener('click', handle_flip)
    }

    





    const board = document.getElementById('board')
    const end_screen = document.createElement('div')
    end_screen.setAttribute('id', 'end_screen')
    end_screen.style.gridColumnStart = 3
    end_screen.style.gridColumnEnd = 7
    end_screen.style.gridRowStart = 2
    end_screen.style.gridRowEnd = 7
    end_screen.classList.add('end_screen')
    board.appendChild(end_screen)


    const black_options = document.createElement('div')
    black_options.classList.add('initial_option')
    end_screen.appendChild(black_options)

    const black_text = document.createElement('div')
    black_text.classList.add('start_text_wrapper')
    black_text.innerHTML = 'Black pieces:'
    black_options.appendChild(black_text)

    const black_option = document.createElement('div')
    black_option.classList.add('option_wrapper')
    black_options.appendChild(black_option)

    const black_human = document.createElement('div')
    black_human.setAttribute('id', 'black_human')
    black_human.classList.add('option_button')
    black_human.innerHTML = 'human'
    black_option.appendChild(black_human)
    black_human.addEventListener('click', handle_black_human)

    const black_computer = document.createElement('div')
    black_computer.setAttribute('id', 'black_computer')
    black_computer.classList.add('option_button')
    black_computer.innerHTML = 'computer'
    black_option.appendChild(black_computer)
    black_computer.addEventListener('click', handle_black_computer)

    const white_options = document.createElement('div')
    white_options.classList.add('initial_option')
    end_screen.appendChild(white_options)

    const white_text = document.createElement('div')
    white_text.classList.add('start_text_wrapper')
    white_text.innerHTML = 'White pieces:'
    white_options.appendChild(white_text)

    const white_option = document.createElement('div')
    white_option.classList.add('option_wrapper')
    white_options.appendChild(white_option)

    const white_human = document.createElement('div')
    white_human.setAttribute('id', 'white_human')
    white_human.classList.add('option_button')
    white_human.innerHTML = 'human'
    white_option.appendChild(white_human)
    white_human.addEventListener('click', handle_white_human)

    const white_computer = document.createElement('div')
    white_computer.setAttribute('id', 'white_computer')
    white_computer.classList.add('option_button')
    white_computer.innerHTML = 'computer'
    white_option.appendChild(white_computer)
    white_computer.addEventListener('click', handle_white_computer)

    const play = document.createElement('div')
    play.setAttribute('id', 'play_button')
    play.classList.add('text_wrapper')
    play.classList.add('reject_play')
    play.innerHTML = 'Play!'
    end_screen.appendChild(play)
    play.addEventListener('click', handle_play)

}

function start_game(){
    
    const screen = document.getElementById('end_screen')
    if (screen){
        screen.remove()
    }


    all_pieces.forEach(piece => {
        piece.reset()
    })

    // DONT FORGET TO DELETE THIS!!
    black_king.first_turn = false
    white_king.first_turn = false

    game_board.orientation = 'white'
    game_board.clear_array()
    game_board.draw_pieces()
    game_board.update_sequence()

    

    turn = 'white'
    last_clicked_id = null
    end_game = false
    previoustime = 0
    result = null
    pause = false
    navigating = false
    previous_piece_moved = null

    if (turn == 'white' && white_player == 'computer' && black_player == 'human'){
        var moves = get_legal_moves(turn, previous_piece_moved)
        computer_turn(computer_type, moves)

        var moves = get_legal_moves(turn, previous_piece_moved)
        var in_check = check_for_check(turn, previous_piece_moved)
        check_game_finished(moves, in_check)

        if (end_game == true){
            game_finished(result)
        }

    }
    
    if (white_player == 'computer' && black_player == 'computer'){
        window.requestAnimationFrame(handleloop)
    }
}




initialise()

document.addEventListener('click', handleclick)


