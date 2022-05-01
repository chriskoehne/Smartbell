import React from 'react';
import { Row } from 'react-bootstrap';
import DashboardCard from './DashboardCard';
import styles from './Dashboard.module.css';

const Dashboard = (props) => {
  return (
    <div className={styles.box}>
      <Row xs={1} md={2} className={styles.cardRow}>
        <DashboardCard name='members'/>
        <DashboardCard name='equipment'/>
        <DashboardCard name='classes'/>
        <DashboardCard name='memberships'/>
      </Row>
    </div>
  );
};

export default Dashboard;
