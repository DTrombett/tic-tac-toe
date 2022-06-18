import "@fortawesome/fontawesome-free/css/all.min.css";
import Head from "next/head";
import { Component } from "react";
import Board from "../components/Board";
import styles from "../styles/utils.module.css";

class Game extends Component {
	constructor(props: Record<string, never>) {
		super(props);

		fetch("/api/match").catch(() => {
			// Just load the match endpoint
		});
	}

	render() {
		return (
			<>
				<Head>
					<title>Tris</title>
				</Head>
				<div className={styles.game}>
					<Board />
				</div>
			</>
		);
	}
}

export default Game;
