"use strict";

// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

/**
 * @typedef {string}
 */
let CoordString;

/**
 * @typedef {{file: string, rank: number}}
 */
let Coord;

/**
 * @typedef {string}
 */
let Piece;

/**
 * @typedef {string}
 */
let Color;

export class Position {
  /**
   * @param {string} fenString
   */
  constructor(fenString) {
    const parsed = parseFen(fenString);

    /** @type {Map<CoordString, Piece>} */
    this.board = parsed.board;
  }
}

/**
 * @param {string} file
 * @param {number} rank
 * @returns {CoordString}
 */
export function toCoordString(file, rank) {
  const str = `${file}${rank}`;
  const throwError = () => {
    throw new Error(`not valid square coordinate: ${str}`);
  };

  if (!FILES.includes(file) || !RANKS.includes(rank)) {
    throwError();
  }

  return str;
}

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * @param {CoordString} stringKey
 * @returns {Coord}
 */
export function fromCoordString(stringKey) {
  const throwError = () => {
    throw new Error(`not valid square coordinate: ${stringKey}`);
  };

  if (stringKey.length !== 2) {
    throwError();
  }

  const file = stringKey[0];
  const rank = Number(stringKey.substring(1));

  return { file, rank };
}

export const ALL_PIECES = "rnbqkbnrpPRNBQKBNR";

/**
 * @param {string} fenString
 * @returns {{
 *    board: Map<CoordString, Piece>,
 *    active: Color,
 *    castling: {
 *      whiteShort: boolean,
 *      whiteLong: boolean,
 *      blackShort: boolean,
 *      blackLong: boolean,
 *    },
 *    enPassantTarget: Coord,
 *    halfmoveClock: number,
 *    fullmoveNumber: number,
 * }}
 */
function parseFen(fenString) {
  const [
    boardStr,
    activeStr,
    castlingStr,
    enPassantTargetStr,
    halfmoveClockStr,
    fullmoveNumberStr,
  ] = fenString.split(" ");

  const board = new Map();

  boardStr
    .split("/")
    .reverse()
    .forEach((rank, rankIndex) => {
      let currFileIndex = 0;
      rank.split("").forEach((c) => {
        const skip = Number(c);
        if (!Number.isNaN(skip)) {
          currFileIndex += skip;
          return;
        }

        if (!ALL_PIECES.includes(c)) {
          throw new Error(`${c} is not a valid piece`);
        }
        board.set(toCoordString(FILES[currFileIndex], RANKS[rankIndex]), c);
        currFileIndex++;
      });
    });

  return {
    board,
  };
}
