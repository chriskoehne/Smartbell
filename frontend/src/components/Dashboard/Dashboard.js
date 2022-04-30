import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MenuCard from './MenuCard';
// import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {
  return (
    <div className={styles.box}>
      <Row xs={1} md={2} className={styles.cardRow}>
        <MenuCard />
        <MenuCard />
        <MenuCard />
        <MenuCard />
      </Row>
    </div>
  );
};

export default Dashboard;
