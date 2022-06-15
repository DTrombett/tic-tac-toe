import type { MouseEventHandler } from "react";
import type { SquareValue } from "../types";
import styles from "./Square.module.css";

const Square = (props: {
	onClick: MouseEventHandler<HTMLButtonElement>;
	value: SquareValue;
}) => (
	<button className={styles.square} onClick={props.onClick}>
		{props.value}
	</button>
);

export default Square;
