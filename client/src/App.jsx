import './App.css'
import Header from './Header'
import Post from './Post'
import Layout from './Layout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import IndexPage from './Pages/IndexPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage/>,
      },
      {
        path: "create",
        element: <CreatePost/>,
      },
      {
        path: "/post/:id",
        element: <PostPage/>,
      },
      {
        path: "/edit/:id",
        element: <EditPost/>,
      },
    ],
  },
]);

function App() {
  return (
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
      
  )
}

export default App
