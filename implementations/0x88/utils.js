const R = require('ramda')

const {
    WHITE,
    BLACK,

    BIA,
    FLIPPED_BIA,
    MA,
    THON,
    MET,
    RUA,
    KHUN,

    DEFAULT_STATE_STRING,

    BIA_MOVE_OFFSETS,
    BIA_ATTACK_OFFSETS,
    THON_MOVE_OFFSETS,
    THON_ATTACK_OFFSETS,
    PIECE_MOVE_OFFSETS,
    PIECE_ATTACK_OFFSETS,

    IS_SLIDING_PIECE,

    SQUARES,
    FIRST_SQUARE,
    LAST_SQUARE,
} = require('./constants')



const swapColor = R.ifElse(
    R.equals(WHITE),
    R.always(BLACK),
    R.always(WHITE)
)


const getAttackOffsets = R.useWith(
    (piece, color) => R.cond([
        [
            R.equals(BIA),
            R.always(BIA_ATTACK_OFFSETS[color])
        ],
        [
            R.equals(THON),
            R.always(THON_ATTACK_OFFSETS[color])
        ],
        [
            R.T,
            R.always(PIECE_ATTACK_OFFSETS[piece])
        ]
    ])(piece),
    [
        R.toLower,
        R.identity
    ]
)

const getMoveOffsets = R.useWith(
    (piece, color) => R.cond([
        [
            R.equals(BIA),
            R.always(BIA_MOVE_OFFSETS[color])
        ],
        [
            R.equals(THON),
            R.always(THON_MOVE_OFFSETS[color])
        ],
        [
            R.T,
            R.always(PIECE_MOVE_OFFSETS[piece])
        ]
    ])(piece),
    [
        R.toLower,
        R.identity
    ]
)

const rank = index => index >> 4
const file = index => index & 7
const algebraic = R.converge(
    R.concat,
    [
        R.pipe(
            file,
            R.flip(R.prop)('abcdefgh')
        ),
        R.pipe(
            rank,
            R.flip(R.prop)('12345678')
        ),
    ]
)
const ascii = boardState => {
    var s = '     +------------------------+\n'
    for (var i = SQUARES.a1; i <= SQUARES.h8; i++) {
        /* display the rank */
        if (file(i) === 0) {
            s += ' ' + '87654321'[rank(i)] + ' |'
        }

        /* empty piece */
        if (boardState[i] == null) {
            s += ' . '
        } else {
            var piece = boardState[i].piece
            var color = boardState[i].color
            var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
            s += ' ' + symbol + ' '
        }

        if ((i + 1) & 0x88) {
            s += '|\n'
            i += 8
        }
    }
    s += '     +------------------------+\n'
    s += '     a  b  c  d  e  f  g  h\n'

    return s
}


module.exports = {
    swapColor,
    getAttackOffsets,
    getMoveOffsets,
    rank,
    file,
    algebraic,
    ascii,
}