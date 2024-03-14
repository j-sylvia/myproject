import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


const baseURL = "https://my-json-server.typicode.com/j-sylvia/ajax/userslist";

function Fetchuser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(baseURL)
      .then(res => {
        const userdata = res.data;
        setUser({ userdata });
      })
  }, []);

  if (!user) return null;

  return (
    <div className='container'>
    <Row xs={2} md={4} className="g-4">
      {user.userdata.map(user => (
        <Col key={user.id}>
          <Card style={{border:'3px solid blue',width: '18rem' }}>
            <Card.Img style={{height:'200px'}} variant="top" src={user.image} />
            <Card.Body>
              <Card.Title><h2>{user.name}</h2></Card.Title>
              <Card.Text>
                {user.email}
              </Card.Text>
              <Button variant="primary">Display Full Detail</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </div>
  );
}

export default Fetchuser;
