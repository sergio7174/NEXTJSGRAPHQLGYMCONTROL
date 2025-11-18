// src/pages/_app.js
import "@/styles/globals.css";
import '../styles/index.css';
import store from "@/redux/store";
import { Provider } from "react-redux";
import ReactModal from "react-modal";
import Wrapper from "../components/layout/wrapper";
import { useEffect } from "react";
// Apollo server libs
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";


export const metadata = {
      icons: {
        icon: '/favicon.png', // Path to your favicon in the public directory
      },
    };

if (typeof window !== "undefined") {
  //require("bootstrap/dist/js/bootstrap");
  require("bootstrap/dist/js/bootstrap.bundle");
}

if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

/*const client = new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:5000/graphql",
      useGETForQueries: true,
    }),
    cache: new InMemoryCache(),
  });*/

 const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});



function App({ Component, pageProps }) {

useEffect(() => {
  // to use bootstrap in nextjs
  require("bootstrap/dist/js/bootstrap.bundle");
}, []);

  return (
  <Provider store={store}>
   
      <Wrapper>
          <div id="root">
            <ApolloProvider client={client}>
              <Component {...pageProps}/> 
             </ApolloProvider>
          </div>
      </Wrapper> 
    
  </Provider> 
    
  )
}

export default App;