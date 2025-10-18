import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LojaRoutes from "./routes/LojaRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz para a área do lojista */}
        <Route path="/" element={<Navigate to="/loja/dashboard" replace />} />

        {/* Rotas do Lojista */}
        <Route path="/loja/*" element={<LojaRoutes />} />

        {/* Rota para página não encontrada */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Página não encontrada</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
