import React from 'react';
import SearchForm from './components/SearchForm';
import { Container } from 'react-bootstrap';

const App = () => {
  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <h1>Search For Users</h1>
      <SearchForm />
    </Container>
  );
};

export default App;
