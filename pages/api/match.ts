import type { NextApiRequest, NextApiResponse } from "next";
import calculateWinner from "../../lib/calculateWinner";

const ids: [number | null, number | null] = [null, null];
const squares: (boolean | null)[] = new Array(9).fill(null);
let playing = false;
let nextPlayer = false;
let toReply: NextApiResponse | null = null;
let pendingSquare: number | null = null;
let callback: (() => void) | null = null;

export const setIds = () => {
	ids[0] = Math.random();
	do ids[1] = Math.random();
	while (ids[0] === ids[1]);
	return ids;
};
export const getPlaying = () => playing;
export const setPlaying = () => {
	playing = true;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	const index = ids.indexOf(Number(req.headers.id));

	if (index === -1) {
		res.status(403).json({
			error: "Invalid ID",
		});
		return;
	}
	if (req.method === "DELETE") {
		res.status(204).end();
		toReply?.status(200).json({
			winner: !index,
		});
		if (callback) toReply?.removeListener("close", callback);
		ids.fill(null);
		squares.fill(null);
		toReply = null;
		playing = nextPlayer = false;
		return;
	}
	if (req.method !== "POST") {
		res.status(405).json({
			error: "Method not allowed",
		});
		return;
	}
	if (!index === nextPlayer) {
		if (toReply) {
			res.status(503).json({
				error: "Not your turn",
			});
			return;
		}
		toReply = res;
		req.socket.once(
			"close",
			(callback = () => {
				if (res === toReply) toReply = null;
			})
		);
		req.socket.setTimeout(0);
		return;
	}
	if (pendingSquare !== null) {
		res.status(200).json({
			square: pendingSquare,
		});
		pendingSquare = null;
		return;
	}
	const { body } = req;
	const i = (body as { i: number } | undefined)?.i;

	if (i === undefined || isNaN(i) || i < 0 || i > 8) {
		res.status(400).json({
			error: "Invalid request body",
		});
		return;
	}
	if (squares[i] !== null) {
		res.status(400).json({
			error: "Square already taken",
		});
		return;
	}
	squares[i] = nextPlayer;
	if (calculateWinner(squares) !== null) {
		res.status(200).json({
			winner: nextPlayer,
		});
		toReply?.status(200).json({
			winner: nextPlayer,
			square: i,
		});
		squares.fill(null);
		playing = nextPlayer = false;
		if (callback) toReply?.removeListener("close", callback);
		toReply = null;
		return;
	}
	if (!squares.includes(null)) {
		res.status(200).json({
			winner: null,
		});
		toReply?.status(200).json({
			winner: null,
			square: i,
		});
		if (callback) toReply?.removeListener("close", callback);
		ids.fill(null);
		squares.fill(null);
		toReply = null;
		playing = nextPlayer = false;
		return;
	}
	nextPlayer = !nextPlayer;
	if (toReply)
		toReply.status(200).json({
			square: i,
		});
	else pendingSquare = i;
	if (callback) toReply?.removeListener("close", callback);
	toReply = res;
	req.socket.once(
		"close",
		(callback = () => {
			if (res === toReply) toReply = null;
		})
	);
	req.socket.setTimeout(0);
};

export default handler;
