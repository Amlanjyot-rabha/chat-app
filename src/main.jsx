 
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import AppContextProvider from './context/context.jsx'
import App from './App.jsx'
 
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AppContextProvider>
      <App />
  </AppContextProvider>
  </BrowserRouter>
   
)
