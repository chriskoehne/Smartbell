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
  const [referredBy, setReferredBy] = useState([]);

  const columns = [
    { text: 'Name', dataField: 'name', sort: true },
    { text: 'Birthday', dataField: 'birthday', sort: true },
    { text: 'Membership', dataField: 'membership_type', sort: true },
    { text: 'Good Standing', dataField: 'good_payment_standing', sort: true },
    { text: 'Last Attended', dataField: 'last_attended', sort: true },
    { text: 'Referrals', dataField: 'referrals', sort: true },
  ];

  const getMembers = async () => {
    const membersRes = await axios.get('/members/');
    if (membersRes.status === 200) {
      return membersRes.data;
    }
  };

  const getOptions = () => {
    let options = [];
    for (const member of members) {
      options.push({ label: `${member.name} (${member.id})`, id: member.id });
    }
    return options;
  };

  const getMemberships = async () => {
    const membershipRes = await axios.get('/memberships/');
    if (membershipRes.status === 200 && membershipRes.data.length) {
      return membershipRes.data;
    }
  };

  const createMember = async () => {
    try {
      const body = {
        name: name,
        birthday: birthday,
        membership_type: membership,
      };
      if (referredBy) {
        body.referred_by = referredBy[0].id;
      }

      const res = await axios.post('/members/', body);
      if (res.status === 201) {
        if (!alert('member created!')) {
          window.location.reload();
        }
      } else {
        if (!alert(res)) {
          window.location.reload();
        }
      }
      console.log(res);
    } catch (err) {
      if (!alert(err)) {
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    console.log(membership);
  }, [membership]);

  useEffect(() => {
    const getData = async () => {
      const members = await getMembers();
      const memberships = await getMemberships();
      setMembers(members);
      setMemberships(memberships);
      if (memberships.length) {
        setMembership(memberships[0].id);
      }
    };
    getData();
  }, [display]);

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
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                console.log('submitted');
                createMember();
              }}
            >
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter name'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='formBasicEmail'>
                    <Form.Label>Membership</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      onChange={(e) => {
                        setMembership(e.target.value);
                        console.log(membership);
                      }}
                    >
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
                  <Form.Group>
                    <Form.Label>Single Selection</Form.Label>
                    <Typeahead
                      id='basic-typeahead-single'
                      onChange={setReferredBy}
                      options={getOptions()}
                      placeholder='Choose a member...'
                      selected={referredBy}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className={mainStyles.submitHouse}>
                <Button className='btnCustom' type='submit'>
                  Submit
                </Button>
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
