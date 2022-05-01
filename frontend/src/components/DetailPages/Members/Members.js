import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import moment from 'moment';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import mainStyles from '../DetailPages.module.css';


const Members = (props) => {
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [display, setDisplay] = useState('post');

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(
    moment(new Date()).format('yyyy-MM-DD')
  );
  const [membership, setMembership] = useState(-1);
  const [referredBy, setReferredBy] = useState(-1);

  const columns = [
    { text: 'Name', dataField: 'name', sort: true },
    { text: 'Birthday', dataField: 'birthday', sort: true },
    { text: 'Membership', dataField: 'membership_type', sort: true },
    { text: 'Good Standing', dataField: 'good_payment_standing', sort: true },
    { text: 'Last Attended', dataField: 'last_attended', sort: true },
    { text: 'Referrals', dataField: 'referrals', sort: true },
  ];

  useEffect(() => {
    const getData = async () => {
      const membersRes = await axios.get('/members/');
      if (membersRes.status == 200) {
        setMembers(membersRes.data);
      }
      const membershipRes = await axios.get('/memberships/');
      if (membershipRes.status == 200) {
        setMemberships(membershipRes.data);
        setMembership(membersRes.data[0].id);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    console.log(birthday);
  }, [birthday]);

  const show = () => {
    if (display === 'get') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>View Members</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('post');
                e.currentTarget.blur();
              }}
            >
              Add a Member
            </Button>
          </div>
          <div className={mainStyles.tableHouse}>
            <BootstrapTable columns={columns} data={members} keyField='id' />
          </div>
        </>
      );
    } else if (display === 'post') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Add a Member</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Members
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type='name' placeholder='Enter name' />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Membership</Form.Label>
                    <Form.Select aria-label='Default select example'>
                      {memberships.map((mem) => (
                        <option key={mem.id} value={mem.id}>
                          {mem.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type='date'
                      value={birthday}
                      onChange={(e) => {
                        setBirthday(e.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Referred By</Form.Label>
                    <Form.Control placeholder='Search for another member' />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </>
      );
    }
  };

  return <div className={mainStyles.box}>{show()}</div>;
};

export default Members;
