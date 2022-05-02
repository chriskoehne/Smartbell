import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';

import mainStyles from '../DetailPages.module.css';

const Memberships = (props) => {
  const [memberships, setMemberships] = useState([]);
  const [display, setDisplay] = useState('get');

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [period, setPeriod] = useState('');
  const [benefits, setBenefits] = useState('');

  const [nameEditing, setNameEditing] = useState('');
  const [costEditing, setCostEditing] = useState('');
  const [periodEditing, setPeriodEditing] = useState('');
  const [benefitsEditing, setBenefitsEditing] = useState('');
  const [idEditing, setIdEditing] = useState('');

  const editFormatter = (cell, row) => {
    return (
      <Button
        // className='editBtn'
        onClick={(e) => {
          console.log(row);
          setNameEditing(row.name);
          setCostEditing(row.cost.slice(1));
          setPeriodEditing(row.payment_periods);
          setBenefitsEditing(row.benefits);
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
          deleteMembership(row.id); // e.currentTarget.blur();
        }}
      >
        Delete
      </Button>
    );
  };

  const columns = [
    { text: 'Name', dataField: 'name', sort: true },
    {
      text: 'Cost',
      dataField: 'cost',
      sort: true,
      sortFunc: (a, b, order) => {
        a = a.slice(1);
        b = b.slice(1);
        if (order === 'asc') {
          return b - a;
        }
        return a - b; // desc
      },
    },
    { text: 'Payment Period', dataField: 'payment_periods', sort: true },
    { text: 'Benefits', dataField: 'benefits', sort: true },
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

  const periodShortToLong = (period) => {
    if (period === 'W') {
      return 'Weekly';
    }
    if (period === 'M') {
      return 'Monthly';
    }
    if (period === 'Y') {
      return 'Yearly';
    }
  };

  const periodsLongToShort = (period) => {
    if (period === 'Weekly') {
      return 'W';
    }
    if (period === 'Monthly') {
      return 'M';
    }
    if (period === 'Yearly') {
      return 'Y';
    }
  };

  const createMembership = async () => {
    try {
      const body = {
        name: name,
        cost: cost,
        payment_periods: periodsLongToShort(period),
        benefits: benefits,
      };

      const res = await axios.post('/memberships/', body);
      if (res.status === 201) {
        if (!alert('membership created!')) {
          window.location.reload();
        }
      } else {
        if (!alert(res)) {
          window.location.reload();
        }
      }
      console.log(res);
    } catch (err) {
      console.log(err);
      if (!alert(err)) {
        // window.location.reload();
      }
    }
  };

  const updateMembership = async () => {
    try {
      const body = {
        name: nameEditing,
        cost: costEditing,
        payment_periods: periodsLongToShort(periodEditing),
        benefits: benefitsEditing,
      };

      console.log(body)

      const res = await axios.put(`/memberships/${idEditing}/`, body);
      if (res.status === 200) {
        if (!alert(`membership ${idEditing} updated!`)) {
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

  const deleteMembership = async (id) => {
    console.log('here');
    try {
      const deleteRes = await axios.delete(`/memberships/${id}/`);
      if (deleteRes.status === 204) {
        if (!alert(`membership ${id} deleted`)) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMemberships = async () => {
    const membershipRes = await axios.get('/memberships/');
    if (membershipRes.status === 200 && membershipRes.data.length) {
      console.log(membershipRes.data);
      let memberships = [];
      for (let membership of membershipRes.data) {
        membership.payment_periods = periodShortToLong(
          membership.payment_periods
        );
        memberships.push(membership);
      }
      return memberships;
    }
  };

  useEffect(() => {
    const getData = async () => {
      const memberships = await getMemberships();
      setMemberships(memberships);
    };
    getData();
  }, [display]);

  const show = () => {
    if (display === 'get') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>View Memberships</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('post');
                e.currentTarget.blur();
              }}
            >
              Add a Membership Type
            </Button>
          </div>
          <div className={mainStyles.tableHouse}>
            <BootstrapTable
              columns={columns}
              data={memberships}
              keyField='id'
            />
          </div>
        </>
      );
    } else if (display === 'post') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Add a Membership Type</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Memberships
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                createMembership();
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
                  <Form.Group className='mb-3' controlId='cost'>
                    <Form.Label>Cost</Form.Label>
                    <Form.Control
                      placeholder='Enter a dollar amount (no "$")'
                      type='number'
                      step='0.01'
                      value={cost}
                      onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                          setCost(+parseFloat(e.target.value).toFixed(2));
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='period'>
                    <Form.Label>Payment Period</Form.Label>
                    <Form.Select
                      aria-label='Default select example'
                      onChange={(e) => {
                        setPeriod(e.target.value);
                      }}
                    >
                      <option key='W' value='Weekly'>
                        Weekly
                      </option>
                      <option key='M' value='Monthly'>
                        Monthly
                      </option>
                      <option key='Y' value='Yearly'>
                        Yearly
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='benefits'>
                    <Form.Label>Benefits</Form.Label>
                    <Form.Control
                      value={benefits}
                      placeholder='Enter benefits'
                      onChange={(e) => {
                        setBenefits(e.target.value);
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
        </>
      );
    } else if (display === 'put') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Edit a Membership Type</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Memberships
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                updateMembership();
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
                  <Form.Group className='mb-3' controlId='cost'>
                    <Form.Label>Cost</Form.Label>
                    <Form.Control
                      placeholder='Enter a dollar amount (no "$")'
                      type='number'
                      step='0.01'
                      value={costEditing}
                      onChange={(e) => {
                        if (!isNaN(e.target.value)) {
                          setCostEditing(
                            +parseFloat(e.target.value).toFixed(2)
                          );
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='period'>
                    <Form.Label>Payment Period</Form.Label>
                    <Form.Select
                      value={periodEditing}
                      aria-label='Default select example'
                      onChange={(e) => {
                        setPeriodEditing(e.target.value);
                      }}
                    >
                      <option key='W' value='Weekly'>
                        Weekly
                      </option>
                      <option key='M' value='Monthly'>
                        Monthly
                      </option>
                      <option key='Y' value='Yearly'>
                        Yearly
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='benefits'>
                    <Form.Label>Benefits</Form.Label>
                    <Form.Control
                      value={benefitsEditing}
                      placeholder='Enter benefits'
                      onChange={(e) => {
                        setBenefitsEditing(e.target.value);
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
        </>
      );
    }
  };
  return <div className={mainStyles.box}>{show()}</div>;
};

export default Memberships;
