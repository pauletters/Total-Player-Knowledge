import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import About from './pages/about.js'
import CreateCharacter from './pages/CreateCharacter.js'
import MyCharacters from './pages/MyCharacters.js'
import MyCampaigns from './pages/MyCampaigns.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import AuthService from './utils/auth.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: AuthService.loggedIn() ? <Navigate to="/create-character" replace /> : <About />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'create-character',
        element: (
          <ProtectedRoute>
            <CreateCharacter />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-characters',
        element: (
          <ProtectedRoute>
            <MyCharacters />
          </ProtectedRoute>
        )
      },
      {
        path: 'my-campaigns',
        element: (
          <ProtectedRoute>
            <MyCampaigns />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
