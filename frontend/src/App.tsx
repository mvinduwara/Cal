import { Calculator } from './components/Calculator';

export default function App() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        background: 'transparent',
      }}
    >
      <Calculator />
    </main>
  );
}