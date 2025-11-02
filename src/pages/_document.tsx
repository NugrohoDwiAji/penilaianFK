import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <title>SIPFK</title>
      <link rel="shortcut icon" href="/img/sipfk.png" type="image/x-icon" />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
