import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import About from './pages/about.js'
import MyCharacters from './pages/MyCharacters.js'
import MyCampaigns from './pages/MyCampaigns.js'
import CharacterCreation from './components/CharacterCreation.js'
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
        element: AuthService.loggedIn() ? <Navigate to="/my-characters" replace /> : <About />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'my-characters',
        element: (
          <ProtectedRoute>
            <MyCharacters />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'character-creation',
            element: (
              <ProtectedRoute>
                <CharacterCreation />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        path: 'character-sheet',
        element: (
          <ProtectedRoute>
            <CharacterCreation />
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
