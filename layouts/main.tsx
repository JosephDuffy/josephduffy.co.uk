import Header from '../components/Header'

const Index: React.FunctionComponent<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <Header />
    <main>
    { children }
    </main>
  </div>
);

export default Index
