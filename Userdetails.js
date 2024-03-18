import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import React from 'react';

function Popup({ show, onHide, userprops }) {
  if (!userprops) {
    return null; 
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      {userprops.map((userprop) => (
        <React.Fragment key={userprop.id}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {userprop.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5> Email: {userprop.email}</h5>
            <p>
             <b>Address: </b> {userprop.address.suite}, {userprop.address.street}, {userprop.address.city}
            </p>
            <p>
             <b>Phone: </b> {userprop.phone}
            </p>
            <p>
             <b>Website: </b> <a href="{userprop.website}">{userprop.website}</a>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={onHide}>Close</Button>
          </Modal.Footer>
        </React.Fragment>
      ))}
    </Modal>
  );
}

const baseURL = "https://my-json-server.typicode.com/j-sylvia/ajax/userslist";

function Fetchuser() {
  const [user, setUser] = useState(null);
  const [filteruser, setFilter] = useState([]);
  const [fullDetails, setFullDetails] = useState({});

  useEffect(() => {
    axios.get(baseURL)
      .then(res => {
        setUser(res.data);
        setFilter(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const Filter = (event) => {
    setFilter(user.filter(f => f.name.toLowerCase().includes(event.target.value.toLowerCase())));
  }

  const handleDisplayDetails = (userId) => {
    setFullDetails((prevState) => ({
      
      [userId]: !prevState[userId],
    }));
  };

  if (!user) return null;

  return (
    <div className='container'>
      <Row xs={2} md={3} lg={4} className="g-4">
        <input type="text" className='form-control' placeholder='Search here...' onChange={Filter} />
        {filteruser.map((user) => (
          <Col key={user.id}>
            <Card style={{ border: '2px solid black', width: '18rem', boxShadow: '2px 10px 15px grey', backgroundColor: 'lightblue' }}>
              <Card.Img style={{ height: '200px' }} variant="top" src={user.image} />
              <Card.Body>
                <Card.Title><h2>{user.name}</h2></Card.Title>
                <Card.Text>
                  {user.email}
                </Card.Text>
                <Button style={{ marginBottom: '20px' }} variant="primary" onClick={() => handleDisplayDetails(user.id)}>Display Full Detail</Button>

                {fullDetails[user.id] && (
                  <Popup show={fullDetails[user.id]} onHide={() => handleDisplayDetails(user.id)} userprops={[user]} />      
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}

      </Row>
    </div>
  );
}

export default Fetchuser;
