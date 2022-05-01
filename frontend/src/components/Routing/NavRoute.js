import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import styles from './NavRoute.module.css';
import { Outlet } from 'react-router-dom';

const OurNavbar = (props) => {
  return (
    <Navbar className={styles.navbar}>
      <Container>
        <Navbar.Brand href='/dashboard'>
          <div className={styles.inlineDiv}>
            <h2 className={styles.brand}>SmartBell</h2>
          </div>
        </Navbar.Brand>
        <Nav>
          {/* <Nav.Link
            style={{ color: 'white', marginRight: '2vw'}}
            href='/notifications'
          >
            <BsBellFill />
          </Nav.Link>

          <Nav.Link
            style={{ color: 'white', marginRight: '2vw'}}
            href='/faq'
            
          >
            FAQ
          </Nav.Link>
          <Nav.Link
            style={{ color: 'white', marginRight: '1vw'}}
            href='/settings'
          >
            settings
          </Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
};

const NavRoute = (props) => {
  /**
   * If authorized, return an outlet that will render child elements
   * If not, return element that will navigate to login page
   */

  return (
    <div className={styles.box}>
      <OurNavbar props={props} />
      <Outlet />
    </div>
  );
};

export default NavRoute;