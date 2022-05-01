import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import styles from './Dashboard.module.css';

const DashboardCard = (props) => {
  let navigate = useNavigate();
  const navigateTo = () => {
    navigate(`/${props.name}`)
  }

  return (
    <Col className={styles.cardCol}>
      <Card
        className={styles.DashboardCard}
        onClick={()=>(navigateTo())}
      >
        <Card.Body>
          <h1>{props.name}</h1>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DashboardCard;
