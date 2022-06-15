import { Component } from "react";
import calculateWinner from "../lib/calculateWinner";
import type { SquareValue } from "../types";
import styles from "./Board.module.css";
import Square from "./Square";

class Board extends Component {
	state: {
		squares: SquareValue[];
		xIsNext: boolean;
	};

	constructor(props: Record<string, never>) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true,
		};
	}

	handleClick(i: number) {
		const squares = this.state.squares.slice();

		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			squares,
			xIsNext: !this.state.xIsNext,
		});
	}

	renderSquare(i: number) {
		return (
			<Square
				value={this.state.squares[i]}
				onClick={() => {
					this.handleClick(i);
				}}
			/>
		);
	}

	render() {
		const winner = calculateWinner(this.state.squares);

		return (
			<div>
				<div className={styles.status}>
					{winner
						? `Winner: ${winner}`
						: `Next player: ${this.state.xIsNext ? "X" : "O"}`}
				</div>
				<div className={styles.boardRow}>
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className={styles.boardRow}>
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className={styles.boardRow}>
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

export default Board;
