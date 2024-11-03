import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaymentManagement from './pagamento/PaymentManagement';
import PaymentForm from './pagamento/PaymentForm';
import SalonList from './gestao/SalonList';
import SalonForm from './gestao/SalonForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payments" element={<PaymentManagement />} />
        <Route path="/payment-form/:id?" element={<PaymentForm />} />
        <Route path="/salons" element={<SalonList />} />
        <Route path="/salon-form/:id?" element={<SalonForm />} />
        {/* Outras rotas */}
      </Routes>
    </Router>
  );
}

export default App;
