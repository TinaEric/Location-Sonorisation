import { Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import Home from './pages/Home.jsx';
import Reservation from './pages/Reservation.jsx';
import Information from './pages/Information.jsx';
import Aide from './pages/Aide.jsx';
import Connexion from './pages/Connexion.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="reservation" element={<Reservation />} />
        <Route path="information" element={<Information />} />
        <Route path="aide" element={<Aide />} />
        <Route path="connexion" element={<Connexion />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}