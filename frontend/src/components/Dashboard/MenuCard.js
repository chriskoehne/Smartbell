import React from 'react';
import { Card, Col } from 'react-bootstrap';
import styles from './Dashboard.module.css';

const MenuCard = (props) => {
  return (
    <Col className={styles.cardCol}>
      <Card
        className={styles.menuCard}
      >
        <Card.Body>
          <Card.Title>weee</Card.Title>
          <Card.Text>asdfasd</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default MenuCard;
