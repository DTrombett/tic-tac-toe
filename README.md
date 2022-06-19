# Multiplayer tic-tac-toe

This multiplayer tic-tac-toe game is a simple game that can be played online with two players.
The UI is simple and intuitive and the entire game is made with JavaScript using Next.js and plain HTTP requests, without any websocket.

The game is meant to be locally hosted and that's why there's no official website at the moment and only one match can be played at a time.

## Try it

To run the game locally, follow the steps below:

- Clone the repository (`git clone https://github.com/DTrombett/tic-tac-toe.git`)
- Move to the directory (`cd tic-tac-toe`)
- Install dependencies (`npm ci`)
- Build the app (`npm run build`)
- Run the app (`npm run start`)
- Open the app in your browser (`http://localhost:3000`)

You can play with yourself opening the app in two tabs/windows but you can also play it with another player connected to the same WiFi network by finding your local IP address and replacing `localhost` with it.

## Prerequisites

This game requires Node.js v14 or higher but was only tested on my local machine, which runs Node.js v18.
If you encounter any issues feel free to open an issue.

To check your Node.js version, run `node --version` in your terminal.

## Memory usage

The game uses a maximum of 50MB of RAM for the server-side code while the client-side code uses around 20MB.

## Contributing

If you want to contribute to this project, feel free to open an issue or pull request.
