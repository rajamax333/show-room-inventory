import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import {Routes} from './routes/routes'
import { ToastContainer } from 'react-toastify';

async function enableMocking() {
  // Enable MSW in both development and production
  const { worker } = await import('./mocks/browser')

  // Start the worker and wait for it to be ready
  return worker.start({
    onUnhandledRequest: 'warn',
  })
}

enableMocking()
  .then(() => {
    console.log('MSW initialized successfully')
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Provider store={store}>
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Provider>
      </StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Failed to initialize MSW:', error)
    // Render app anyway if MSW fails
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Provider store={store}>
          <Routes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Provider>
      </StrictMode>,
    )
  })
