import React from 'react';
import {DAppProvider} from '@usedapp/core';
import {Header} from './components/Header'
import {Container} from '@material-ui/core'
import {Main} from './components/Main'
import {Kovan} from '@usedapp/core'
import './index.css'

function App() {
  return (
    <div className="App">
      <DAppProvider config={{
        networks: [Kovan],
        notifications:{
          expirationPeriod: 1000,
          checkInterval: 1000,
        }
      }}>
        <Header/>
        <Container maxWidth="md">
          <Main/>
        </Container>
      </DAppProvider>
    </div>
  );
}

export default App;
