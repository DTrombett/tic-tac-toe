import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaying, ids, setPlaying } from "./match";

let toReply: NextApiResponse | null = null;
let callback: (() => void) | null = null;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (toReply) {
		setPlaying();
		ids[0] = Math.random();
		do ids[1] = Math.random();
		while (ids[0] === ids[1]);
		toReply.status(200).json({
			id: ids[0],
			x: true,
		});
		res.status(200).json({
			id: ids[1],
			x: false,
		});
		if (callback) toReply.socket?.off("close", callback);
		toReply = null;
		return;
	}
	if (getPlaying()) {
		res.status(503).json({
			error: "Game in progress",
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
};

export default handler;
