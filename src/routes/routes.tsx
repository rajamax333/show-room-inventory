import { BrowserRouter as Router, Route, Routes as RouterRoutes } from 'react-router-dom';
import App from '../App';

export const Routes = () => {
    return (
        <Router>
            <RouterRoutes>
                <Route path="/*" element={<App />} />
            </RouterRoutes>
        </Router>
    );
};
