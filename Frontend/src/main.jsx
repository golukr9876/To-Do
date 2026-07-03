import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'

import { SignUpPage, LoginPage, Home, AddTodo, UpdateTodo, ProfilePage, VerifyOtp, ImagePage, ChangeProfilePIc} from './page/index.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthLayout from './components/AuthLayout.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <SignUpPage />
          </AuthLayout>
        )
      },
      {
        path: "/verify-otp/:slug",
        element:(
          <AuthLayout authentication={false}>
            <VerifyOtp />
          </AuthLayout>
        )
      },
      {
        path: "/createtodo",
        element: (
          <AuthLayout authentication={true}>
            <AddTodo />
          </AuthLayout>
        )
      },
      {
        path: "/updatetodo/:slug",
        element: (
          <AuthLayout authentication={true}>
            <UpdateTodo />
          </AuthLayout>
        )
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <ProfilePage />
          </AuthLayout>
        )
      },
      {
        path: "/profile-pic",
        element: (
          <AuthLayout authentication={true}>
            <ImagePage />
          </AuthLayout>
        )
      },
      {
        path: "/change-profile-pic",
        element: (
          <AuthLayout authentication={true}>
            <ChangeProfilePIc />
          </AuthLayout>
        )
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
