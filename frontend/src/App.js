import React  from 'react';
import './App.css';
import chat from './pages/chat.js'
import home from './pages/home.js'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={home} />
          <Route exact path="/chat" component={chat} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
