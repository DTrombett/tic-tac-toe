import { Head, Html, Main, NextScript } from "next/document";

const Document = () => (
	<Html lang="en">
		<Head>
			<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			<link rel="icon" href="/favicon.ico" type="image/x-icon" />
			<meta name="theme-color" content="black" />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default Document;
