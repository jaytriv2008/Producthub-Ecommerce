import { Link } from 'react-router-dom';
import Button from '../components/Button';

type PlaceholderPageProps = { title: string; description: string };

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => (
  <main className="container section">
    <p className="eyebrow">PRODUCTHUB</p>
    <h1 className="section-title">{title}</h1>
    <p className="section-description">{description}</p>
    <div style={{ marginTop: 24 }}>
      <Link to="/products"><Button>Browse products</Button></Link>
    </div>
  </main>
);

export default PlaceholderPage;
