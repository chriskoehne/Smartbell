import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import moment from 'moment';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import mainStyles from '../DetailPages.module.css';

const Equipment = (props) => {
  
  const [equipment, setEquipment] = useState([]);
  const [display, setDisplay] = useState('post');

  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  const columns = [
    { text: 'Machine Name', dataField: 'name', sort: true },
    { text: 'Employee Notes', dataField: 'notes', sort: true },
    { text: 'Quality Status', dataField: 'status', sort: true }
  ];

  const getEquipment = async () => {
    const equipmentRes = await axios.get('/equipment/');
    if (equipmentRes.status === 200) {
      return equipmentRes.data;
    }
  }


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
          <div className={mainStyles.tableHouse}>
            <BootstrapTable columns={columns} data={equipment} keyField='id' />
          </div>
        </>
      );
    } else if (display === 'post') {
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
            <Form>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Equipment ID</Form.Label>
                  <Form.Control type='name' placeholder='Enter equipment ID' />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Machine Name</Form.Label>
                  <Form.Control type='name' placeholder='Enter machine name' />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Employee Notes</Form.Label>
                  <Form.Control type='name' placeholder='Enter notes' />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group className='mb-3' controlId='formBasicEmail'>
                  <Form.Label>Quality Status</Form.Label>
                  <Form.Control type='name' placeholder='Enter quality status' />
                </Form.Group>
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