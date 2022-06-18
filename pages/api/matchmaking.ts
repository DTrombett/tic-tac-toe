import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaying, setIds, setPlaying } from "./match";

let toReply: NextApiResponse | null = null;

const handler = (req: NextApiRequest, res: NextApiResponse) => {
	if (toReply) {
		setPlaying();
		const ids = setIds();
		toReply.status(200).json({
			id: ids[0],
			x: true,
		});
		res.status(200).json({
			id: ids[1],
			x: false,
		});
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
	req.socket.on("close", () => {
		if (res === toReply) toReply = null;
	});
	req.socket.setTimeout(0);
};

export default handler;
