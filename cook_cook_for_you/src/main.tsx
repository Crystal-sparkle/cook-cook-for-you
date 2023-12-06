import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import Profile from "./Profile/index.tsx";
// import "./index.css";
import AddDailyMeal from "./AddDailyMeal/index.tsx";
import RecipeList from "./pages/Recipes/RecipeForm.tsx";
import Recipes from "./pages/Recipes/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/dailymealplan" element={<AddDailyMeal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipelist" element={<RecipeList />} />
        RecipeList
      </Route>
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);
