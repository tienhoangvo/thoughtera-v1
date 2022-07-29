import { createGetInitialProps } from '@mantine/next'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

const getInitialProps = createGetInitialProps()

class Document extends NextDocument {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Mali:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600;1,700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
