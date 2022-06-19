export type SquareValue = boolean | null;

export type State<T> = BaseState & T;

export type BaseState = {
	squares: SquareValue[];
};

export type PlayingState = {
	myTurn: boolean;
	winner?: undefined;
	id: number;
	isX: boolean;
	message?: undefined;
	matchmaking?: undefined;
};

export type FinishedState = {
	myTurn?: undefined;
	winner: SquareValue;
	id: number;
	isX: boolean;
	message?: undefined;
	matchmaking?: true;
};

export type IdleState = {
	myTurn?: undefined;
	winner?: undefined;
	id?: undefined;
	isX?: undefined;
	message?: string;
	matchmaking?: true;
};
