import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import moment from 'moment';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import mainStyles from '../DetailPages.module.css';

const Equipment = (props) => {
  const [equipment, setEquipment] = useState('');
  const [display, setDisplay] = useState('get');

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  const [nameParam, setNameParam] = useState([]);
  const [statusParam, setStatusParam] = useState([]);
  const [notesParam, setNotesParam] = useState([]);

  const [nameEditing, setNameEditing] = useState('');
  const [statusEditing, setStatusEditing] = useState('');
  const [notesEditing, setNotesEditing] = useState('');
  const [idEditing, setIdEditing] = useState('');

  const editFormatter = (cell, row) => {
    return (
      <Button
        onClick={(e) => {
          console.log(row);
          setNameEditing(row.name);
          setStatusEditing(row.status);
          setNotesEditing(row.notes);
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
        onClick={(e) => {
          deleteEquipment(row.id); // e.currentTarget.blur();
        }}
      >
        Delete
      </Button>
    );
  };

  const columns = [
    { text: 'Machine Name', dataField: 'name', sort: true },
    { text: 'Employee Notes', dataField: 'notes', sort: true },
    { text: 'Quality Status', dataField: 'status', sort: true },
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

  const getEquipment = async () => {
    console.log('name param is -1-' + nameParam + '----');
    const equipmentRes = await axios.get('/equipment/', {
      params: { name: nameParam, notes: notesParam, status: statusParam },
    });
    console.log('EQUIPMENT RES: ' + equipmentRes);
    console.log('name param is -2-' + nameParam + '----');

    //  , {
    //    params: { name: nameParam,
    //              notes: notesParam,
    //              status: statusParam }
    //  }

    if (equipmentRes.status === 200) {
      console.log('EQUIPMENT RES DATA: ' + equipmentRes.data);
      setEquipment(equipmentRes.data);
      return equipmentRes.data;
    }
  };

  const createEquipment = async () => {
    try {
      const body = {
        name: name,
        status: status,
        notes: notes,
      };
      const res = await axios.post('/equipment/', body);
      if (res.status === 201) {
        if (!alert('equipment created!')) {
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

  const updateEquipment = async () => {
    try {
      const body = {
        name: nameEditing,
        status: statusEditing,
        notes: notesEditing,
      };

      console.log('ID editing is: ' + idEditing);
      const res = await axios.put(`/equipment/${idEditing}/`, body);
      if (res.status === 200) {
        if (!alert(`Equipment ${idEditing} updated!`)) {
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

  const deleteEquipment = async (id) => {
    console.log('here');
    try {
      const deleteRes = await axios.delete(`/equipment/${id}/`);
      if (deleteRes.status === 204) {
        if (!alert(`Equipment ${id} deleted`)) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(equipment);
  }, [equipment]);

  useEffect(() => {
    const getData = async () => {
      const equipment = await getEquipment();
      setEquipment(equipment);
    };
    getData();
  }, [display]);

  const show = () => {
    if (display === 'get') {
      // VIEW EQUIPMENT PAGE
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>View Equipment</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('post');
                e.currentTarget.blur();
              }}
            >
              Add Equipment
            </Button>
          </div>

          {/* FORMERLY THE EDIT CODE: */}

          <div className={mainStyles.topper}>
            <h2>Query Equipment</h2>
          </div>
          <div style={{ margin: '5%', marginTop: '1%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                getEquipment();
              }}
            >
              <Row>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter name'
                      onChange={(e) => {
                        setNameParam(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter status'
                      onChange={(e) => {
                        setStatusParam(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter notes'
                      onChange={(e) => {
                        setNotesParam(e.target.value);
                      }}
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
          <div className={mainStyles.tableHouse}>
            <BootstrapTable columns={columns} data={equipment} keyField='id' />
          </div>
        </>
      );
    } else if (display === 'post') {
      // ADD EQUIPMENT PAGE
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Add Equipment</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Equipment
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                createEquipment();
              }}
            >
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Machine Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter machine name'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Employee Notes</Form.Label>
                  <Form.Control
                    placeholder='Enter notes'
                    onChange={(e) => {
                      setNotes(e.target.value);
                    }}
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Quality Status</Form.Label>
                  <Form.Control
                    placeholder='Enter quality status'
                    onChange={(e) => {
                      setStatus(e.target.value);
                    }}
                  />
                </Form.Group>
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
      // EDIT EQUIPMENT PAGE
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Edit Equipment</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Equipment
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                updateEquipment();
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
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter status'
                      value={statusEditing}
                      onChange={(e) => {
                        setStatusEditing(e.target.value);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className='mb-3' controlId='name'>
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      type='name'
                      placeholder='Enter status'
                      value={notesEditing}
                      onChange={(e) => {
                        setNotesEditing(e.target.value);
                      }}
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
export default Equipment;
