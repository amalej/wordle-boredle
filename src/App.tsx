import "./App.css";
import Game from "./components/Game/Game";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Game />
      <ToastContainer
        position="top-center"
        autoClose={1250}
        hideProgressBar
        newestOnTop
        theme="colored"
      />
    </>
  );
}

export default App;
