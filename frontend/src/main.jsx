import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { add } from './redux/userSlice.js'
import { Provider } from 'react-redux'


const token = localStorage.getItem('authorization');
if (token) {
  //console.log(token)
  store.dispatch(add(token));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    
  </StrictMode>,
)
