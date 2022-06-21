import { Component } from "react";
import calculateWinner from "../lib/calculateWinner";
import type { FinishedState, IdleState, PlayingState, State } from "../types";
import styles from "./Board.module.css";
import Square from "./Square";

let controller: AbortController | undefined;

class Board extends Component {
	state: State<FinishedState | IdleState | PlayingState>;

	constructor(props: Record<string, never>) {
		super(props);
		this.state = {
			squares: Array(9).fill(null),
		};
	}

	setState(state: Partial<Board["state"]>) {
		super.setState(state);
	}

	isPlaying(): this is this & {
		state: State<PlayingState>;
	} {
		return this.state.myTurn !== undefined;
	}

	isFinished(): this is this & {
		state: State<FinishedState>;
	} {
		return this.state.winner !== undefined;
	}

	isIdle(): this is this & {
		state: State<IdleState>;
	} {
		return this.state.myTurn === this.state.winner;
	}

	handleIncomingData(
		data: { winner?: 0 | 1 | null; square?: number } | undefined
	) {
		if (data === undefined) return;
		const newSquares = this.state.squares.slice();

		if (data.square !== undefined) newSquares[data.square] = this.state.isX!;
		if (data.winner === undefined)
			this.setState({
				squares: newSquares,
				myTurn: true,
			});
		else
			this.setState({
				squares: newSquares,
				myTurn: undefined,
				winner: data.winner === null ? null : Boolean(data.winner),
			});
	}

	async handleSquareResponse(res: Response, i?: number) {
		switch (res.status) {
			case 403:
				this.setState({
					myTurn: undefined,
					winner: !this.state.isX!,
				});
				break;
			case 400:
				const newSquares = this.state.squares.slice();

				newSquares[i!] = this.state.isX!;
				this.setState({
					squares: newSquares,
					myTurn: true,
				});
				break;
			case 200:
				this.handleIncomingData(await res.json());
				break;
			default:
		}
		return undefined;
	}

	handleClick(i: number) {
		if (
			!this.isPlaying() ||
			!this.state.myTurn ||
			this.state.squares[i] !== null
		)
			return;
		const squares = this.state.squares.slice();

		squares[i] = !this.state.isX;

		if (calculateWinner(squares) === null)
			this.setState({
				squares,
				myTurn: false,
			});
		else if (!squares.includes(null))
			this.setState({
				squares,
				myTurn: undefined,
				winner: null,
			});
		else
			this.setState({
				squares,
				myTurn: undefined,
				winner: !this.state.isX,
			});
		fetch("/api/match", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"id": this.state.id.toString(),
			},
			body: JSON.stringify({ i }),
			keepalive: true,
		})
			.then((res) => this.handleSquareResponse(res, i))
			.catch(console.error);
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
		return (
			<div>
				<div className={styles.status}>
					{this.isPlaying()
						? this.state.myTurn
							? `Tocca a te (${this.state.isX ? "X" : "O"})!`
							: "In attesa del tuo avversario..."
						: this.isFinished()
						? (this.state.winner === null
								? "Pareggio!"
								: this.state.winner === !this.state.isX
								? "Hai vinto!"
								: "Hai perso!") +
						  (this.state.matchmaking
								? "\nCercando un altro avversario..."
								: "")
						: this.state.matchmaking
						? "Cercando un avversario..."
						: this.state.message ??
						  "Clicca il pulsante per iniziare una nuova partita online!"}
				</div>
				{!this.isIdle() && (
					<div className={styles.squares}>
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
				)}
				<div className={`buttons ${styles.buttons}`}>
					{!(this.isPlaying() || this.state.matchmaking) && (
						<button
							className={`${styles.actionButton} button`}
							onClick={() => {
								this.setState({
									matchmaking: true,
								});
								fetch("/api/matchmaking", {
									keepalive: true,
									signal: (controller = new AbortController()).signal,
								})
									.then((res) => {
										if (res.status === 200) return res.json();
										this.setState({
											myTurn: undefined,
											winner: undefined,
											id: undefined,
											isX: undefined,
											message: "Un'altra partita è già in corso!",
											matchmaking: undefined,
										});
										return undefined;
									})
									.then((data: { id: number; x: boolean } | undefined) => {
										if (data === undefined) return undefined;
										this.setState({
											squares: Array(9).fill(null),
											myTurn: data.x,
											winner: undefined,
											id: data.id,
											isX: data.x,
											message: undefined,
											matchmaking: undefined,
										});
										if (!data.x)
											return fetch("/api/match", {
												method: "POST",
												headers: {
													id: data.id.toString(),
												},
												keepalive: true,
											});
										return undefined;
									})
									.then((res) => res && this.handleSquareResponse(res))
									.catch(console.error);
							}}
						>
							Cerca avversario
						</button>
					)}
					{this.isPlaying() && (
						<button
							className={`${styles.actionButton} button`}
							onClick={() => {
								if (
									// eslint-disable-next-line no-alert
									!confirm("Sei sicuro di volerti arrendere?") ||
									!this.isPlaying()
								)
									return;
								this.setState({
									myTurn: undefined,
									winner: this.state.isX,
								});
								fetch("/api/match", {
									method: "DELETE",
									headers: {
										id: this.state.id.toString(),
									},
									keepalive: true,
								}).catch(console.error);
							}}
						>
							Arrenditi
						</button>
					)}
					{this.state.matchmaking && (
						<button
							className={`${styles.actionButton} button`}
							onClick={() => {
								this.setState({
									matchmaking: undefined,
								});
								controller?.abort();
							}}
						>
							Cancella
						</button>
					)}
				</div>
			</div>
		);
	}
}

export default Board;
