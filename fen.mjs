"use strict";

import { Chess } from "./chess.js";

// https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation

/**
 * E.g. "a4"
 * @typedef {string}
 */
let CoordString;

/**
 * E.g. {file: "a", rank: 4}
 * @typedef {{file: string, rank: number}}
 */
let Coord;

/**
 * E.g. "p" for black pawn, "K" for white king
 * @typedef {string}
 */
let Piece;

/**
 * "w" for white, "b" for black
 * @typedef {string}
 */
let Color;

export class Position {
  /**
   * @param {string} fenString
   */
  constructor(fenString) {
    /** @type {Chess} */
    this.chess = new Chess(fenString);
  }

  /**
   * @returns {Map<CoordString, Piece>}
   */
  get board() {
    return new Map(
      this.chess.board().map((rank) =>
        rank
          .flatMap((item) => (item ? [item] : []))
          .map(({ square, type, color }) => {
            return [square, color === "w" ? type.toUpperCase() : type.toLowerCase()];
          }).flat()
      )
    );
  }

  /**
   * Description
   * @param {CoordString|Coord} square
   * @returns {Piece}
   */
  get(square) {
    const squareString =
      typeof square === "string" ? square : toCoordString(square);
    const piece = this.chess.get(squareString);

    if (piece == null) {
      return undefined;
    }

    const { type, color } = piece;
    return color === "w" ? type.toUpperCase() : type.toLowerCase();
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
