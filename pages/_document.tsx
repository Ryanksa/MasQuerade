import { Html, Head, Main, NextScript } from "next/document";

function Document() {
  return (
    <Html>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@1,700&family=KoHo:wght@600&display=swap&family=Gowun+Dodum&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="custom-scrollbar">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
