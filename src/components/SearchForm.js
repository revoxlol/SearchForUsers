import React, { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const SearchForm = () => {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  let cancelToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      return setError('Invalid email format');
    }

    try {
      if (cancelToken) {
        cancelToken.cancel();
      }
      cancelToken = axios.CancelToken.source();

      const response = await axios.post(
        'http://localhost:5000/search',
        { email, number: number.replace(/-/g, '') },
        { cancelToken: cancelToken.token }
      );
      setResults(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        setError('Error fetching data');
      }
    }
    setLoading(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNumber" className="mt-3">
              <Form.Label>Number</Form.Label>
              <InputMask
                mask="99-99-99"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="form-control"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
              {loading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          <div className="mt-4">
            <h3>Results:</h3>
            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="border p-2 mb-2">
                  <p>Email: {result.email}</p>
                  <p>Number: {result.number}</p>
                </div>
              ))
            ) : (
              !loading && <p>No users found with those credentials. Please Check again</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default SearchForm;
