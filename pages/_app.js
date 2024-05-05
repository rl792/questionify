import "../styles/globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <div>
      <SessionProvider session={session}>
        <Head>
          <title>Questionify Home</title>
          <meta name="description" content="Questionify homepage" />
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
          ></link>
        </Head>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          {/* Make the main content area grow to push the footer down */}
          <div style={{ flexGrow: 1, paddingTop: '12px' }}>
            <Component {...pageProps} />
          </div>
          <Footer />
      </div>
      </SessionProvider>
    </div>
  );
}

export default MyApp;
