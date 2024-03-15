import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


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
      .catch(err=>console.log(err));
  }, []);

  const Filter=(event)=>{
    setFilter(user.filter(f=>f.name.toLowerCase().includes(event.target.value)))
  }

  const handleDisplayDetails = (userId) => {
    setFullDetails(prevState => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };
  

  if (!user) return null;

  return (
    <div className='container'>
    
    <Row xs={2} md={4} className="g-4">
    <input type="text" className='form-control' placeholder='Search here...' onChange={Filter} />
      {filteruser.map(user => (
        <Col key={user.id}>
          <Card style={{border:'3px solid black',width: '18rem',boxShadow:'2px 10px 15px grey' }}>
            <Card.Img style={{height:'200px'}} variant="top" src={user.image} />
            <Card.Body>
              <Card.Title><h2>{user.name}</h2></Card.Title>
              <Card.Text>
                {user.email}
              </Card.Text>
              <Button style={{marginBottom:'20px'}} variant="primary" onClick={()=>handleDisplayDetails(user.id)}>Display Full Detail</Button>
              {fullDetails[user.id] && (
  <div style={{border:'3px solid blue'}} key={user.id}>
    <p style={{marginTop:'10px'}}><b>User name:</b> {user.username}</p>
   <p><b>Address:</b> {user.address.suite}, {user.address.street}, {user.address.city}</p>
   <p><b>Phone:</b> {user.phone}</p>
   <p><b>Website:</b> {user.website}</p>
    <p></p>
  </div>
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
