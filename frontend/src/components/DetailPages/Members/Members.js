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
  const [display, setDisplay] = useState('get');

  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(
    moment(new Date()).format('yyyy-MM-DD')
  );
  const [membership, setMembership] = useState('');
  const [referredBy, setReferredBy] = useState([]);

  const [nameEditing, setNameEditing] = useState('');
  const [birthdayEditing, setBirthdayEditing] = useState('');
  const [referralEditing, setReferralEditing] = useState('');
  const [startDateEditing, setStartDateEditing] = useState('')
  const [endDateEditing, setEndDateEditing] = useState('')
  const [membershipEditing, setMembershipEditing] = useState('');
  const [paymentEditing, setPaymentEditing] = useState('');
  const [idEditing, setIdEditing] = useState(-1);

  const editFormatter = (cell, row) => {
    return (
      <Button
        // className='editBtn'
        onClick={(e) => {
          console.log(row);
          setNameEditing(row.name);
          setBirthdayEditing(row.birthday);
          setMembershipEditing(row.membership_type);
          setPaymentEditing(row.good_payment_standing);
          setIdEditing(row.id);
          setDisplay('put');
          // e.currentTarget.blur();
        }}
      >
        Edit
      </Button>
    );
  };
  const deleteFormatter = (cell, row) => {
    return (
      <Button
        variant='danger'
        // className='editBtn'
        onClick={(e) => {
          deleteMember(row.id); // e.currentTarget.blur();
        }}
      >
        Delete
      </Button>
    );
  };

  const columns = [
    { text: 'Name', dataField: 'name', sort: true },
    { text: 'Birthday', dataField: 'birthday', sort: true },
    { text: 'Membership', dataField: 'membership_type', sort: true },
    { text: 'Good Standing', dataField: 'good_payment_standing', sort: true },
    { text: 'Last Attended', dataField: 'last_attended', sort: true },
    { text: 'Referrals', dataField: 'referrals', sort: true },
    {
      text: 'Edit',
      dataField: 'edit',
      isDummyField: true,
      csvExport: false,
      formatter: editFormatter,
    },
    {
      text: 'Delete',
      dataField: 'delete',
      isDummyField: true,
      csvExport: false,
      formatter: deleteFormatter,
    },
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
      if (referredBy && referredBy.length) {
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

  const updateMember = async () => {
    try {
      const body = {
        name: nameEditing,
        birthday: birthdayEditing,
        membership_type: membershipEditing,
        good_payment_standing: paymentEditing,
      };

      const res = await axios.put(`/members/${idEditing}/`, body);
      if (res.status === 200) {
        if (!alert(`member ${idEditing} updated!`)) {
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

  const deleteMember = async (id) => {
    console.log('here');
    try {
      const deleteRes = await axios.delete(`/members/${id}/`);
      if (deleteRes.status === 204) {
        if (!alert(`member ${id} deleted`)) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   console.log(memberships);
  // }, [memberships]);

  useEffect(() => {
    const getData = async () => {
      const members = await getMembers();
      const memberships = await getMemberships();
      setMembers(members);
      setMemberships(memberships);
      if (memberships.length) {
        setMembership(memberships[0].name);
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
          <div className={mainStyles.topper}>
            <h2>Query Members</h2>
          </div>
          <div style={{ margin: '5%', marginTop: '1%' }}>
            <Form
              onSubmit={ async (e) => {
                e.preventDefault();
                const res = await axios.get('/members/', {
                  params: {name: nameEditing , 
                    membership_type: membershipEditing, 
                    referrals: referralEditing, 
                    good_payment_standing: paymentEditing,
                    startDate: startDateEditing,
                    endDate: endDateEditing,
                  }
                });
                if (res.status === 200) {
                  console.log(res.data);
                  setMembers(res.data);
                }
        
              }}
            >
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter name'
                      value={nameEditing}
                      onChange={(e) => {
                        setNameEditing(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='membership'>
                    <Form.Label>Membership</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      onChange={(e) => {
                        setMembershipEditing(e.target.value);
                        console.log(membershipEditing);
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
                  <Form.Group className='mb-3' controlId='referrals'>
                    <Form.Label>Referrals</Form.Label>
                    <Form.Control
                      type='referrals'
                      value={referralEditing}
                      onChange={(e) => {
                        setReferralEditing(e.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='membership'>
                    <Form.Label>Good Payment Standing?</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      value={paymentEditing}
                      onChange={(e) => {
                        setPaymentEditing(e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      <option key={1} value={1}>
                        True
                      </option>
                      <option key={0} value={0}>
                        False
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
              <Col>
                  <Form.Group className='mb-3' controlId='birthday'>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type='date'
                      value={startDateEditing}
                      onChange={(e) => {
                        setStartDateEditing(e.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='birthday'>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type='date'
                      value={endDateEditing}
                      onChange={(e) => {
                        setEndDateEditing(e.target.value);
                      }}
                    ></Form.Control>
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
                createMember();
              }}
            >
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
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
                  <Form.Group className='mb-3' controlId='membership'>
                    <Form.Label>Membership</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      onChange={(e) => {
                        setMembership(e.target.value);
                        console.log(membership);
                      }}
                    >
                      {memberships.map((mem) => (
                        <option key={mem.id} value={mem.name}>
                          {mem.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='birthday'>
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
                  <Form.Group className='mb-3' controlId='referral'>
                    <Form.Label>Referred By</Form.Label>
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
    } else if (display === 'put') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Edit Member</h1>
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
                updateMember();
              }}
            >
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter name'
                      value={nameEditing}
                      onChange={(e) => {
                        setNameEditing(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='membership'>
                    <Form.Label>Membership</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      onChange={(e) => {
                        setMembershipEditing(e.target.value);
                        console.log(membershipEditing);
                      }}
                    >
                      {memberships.map((mem) => (
                        <option key={mem.id} value={mem.name}>
                          {mem.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='referrals'>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type='date'
                      value={birthdayEditing}
                      onChange={(e) => {
                        setBirthdayEditing(e.target.value);
                      }}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='membership'>
                    <Form.Label>Good Payment Standing?</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      value={paymentEditing}
                      onChange={(e) => {
                        setPaymentEditing(e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      <option key={1} value={true}>
                        True
                      </option>
                      <option key={0} value={false}>
                        False
                      </option>
                    </Form.Select>
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
