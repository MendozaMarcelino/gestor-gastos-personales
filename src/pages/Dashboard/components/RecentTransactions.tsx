import { Card, ListGroup } from 'react-bootstrap';

// INTERFAZ: Estructura de cada transacción
interface Transaction {
  id: number;                   
  type: 'ingreso' | 'gasto';     
  name: string;                  
  date: string;                  
  amount: number;                
}

// INTERFAZ: Propiedades que recibe el componente
interface RecentTransactionsProps {
  transactions: Transaction[];   
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <h5 className="mb-4">Transacciones Recientes</h5>
        <ListGroup variant="flush">
          {/* CONDICIONAL: Muestra lista si hay transacciones, sino muestra mensaje */}
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <ListGroup.Item key={transaction.id} className="px-0">
                {/* LAYOUT: Distribución horizontal de la información */}
                <div className="d-flex justify-content-between align-items-center">
                  {/* SECCIÓN IZQUIERDA: Ícono y detalles */}
                  <div className="d-flex align-items-center">
                   
                    
                    {/* INFORMACIÓN: Nombre y fecha */}
                    <div>
                      <div className="fw-semibold">{transaction.name}</div>
                      <small className="text-muted">{new Date(transaction.date).toLocaleDateString('es-ES')}</small>
                    </div>
                  </div>
                  {/* SECCIÓN DERECHA: Monto con signo + o - */}
                  <div className={`fw-bold text-${transaction.type === 'ingreso' ? 'success' : 'danger'}`}>
                    {transaction.type === 'ingreso' ? '+' : '-'}$ {transaction.amount.toFixed(2)}
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-muted text-center">No hay transacciones recientes</p>
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}
