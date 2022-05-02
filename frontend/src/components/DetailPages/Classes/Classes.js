import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Typeahead } from 'react-bootstrap-typeahead';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import axios from 'axios';
import moment from 'moment';

import mainStyles from '../DetailPages.module.css';

const Classes = (props) => {
  const [gymClasses, setGymClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [display, setDisplay] = useState('get');

  const [instructor, setInstructor] = useState([]);
  const [cost, setCost] = useState('');
  const [datetime, setDatetime] = useState(moment(new Date()));

  const [instructorEditing, setInstructorEditing] = useState([]);
  const [costEditing, setCostEditing] = useState('');
  const [datetimeEditing, setDatetimeEditing] = useState(moment(new Date()));
  const [idEditing, setIdEditing] = useState('');

  const [viewingId, setViewingId] = useState('');
  const [viewingInstructor, setViewingInstructor] = useState('');
  const [viewingDate, setViewingDate] = useState('');
  const [attendance, setAttendance] = useState([]);

  const editFormatter = (cell, row) => {
    return (
      <Button
        // className='editBtn'
        onClick={(e) => {
          console.log(row);
          setInstructorEditing([
            {
              label: `${row.instructor.name} (${row.instructor.id})`,
              id: row.instructor.id,
            },
          ]);
          setCostEditing(row.cost.slice(1));
          setDatetimeEditing(row.datetime);
          setIdEditing(row.id);
          setDisplay('put');
          // e.currentTarget.blur();
        }}
      >
        Edit
      </Button>
    );
  };

  const viewFormatter = (cell, row) => {
    return (
      <Button
        // className='editBtn'
        onClick={(e) => {
          console.log(row)
          setDisplay('view');
          setViewingId(row.id);
          setViewingInstructor(row.instructor.name)
          setViewingDate(row.datetime)
          // e.currentTarget.blur();
        }}
      >
        View Attendance
      </Button>
    );
  };
  const deleteFormatter = (cell, row) => {
    return (
      <Button
        variant='danger'
        // className='editBtn'
        onClick={(e) => {
          deleteGymClass(row.id); // e.currentTarget.blur();
        }}
      >
        Delete
      </Button>
    );
  };

  const columns = [
    { text: 'Instructor', dataField: 'instructor.name', sort: true },
    { text: 'Cost', dataField: 'cost', sort: true },
    { text: 'Date & Time', dataField: 'datetime', sort: true },
    {
      text: 'View Attendance',
      dataField: 'view attendance',
      isDummyField: true,
      csvExport: false,
      formatter: viewFormatter,
    },
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

  const viewColumns = [
    { text: 'Name', dataField: 'name', sort: true },
    { text: 'Birthday', dataField: 'birthday', sort: true },
    { text: 'Membership', dataField: 'membership_type', sort: true },
    { text: 'Last Attended', dataField: 'last_attended', sort: true },
  ];

  const getOptions = () => {
    let options = [];
    for (const instructor of instructors) {
      options.push({
        label: `${instructor.name} (${instructor.id})`,
        id: instructor.id,
      });
    }
    return options;
  };

  // useEffect(() => {
  //   console.log(datetime.format('MM/DD/YYYY HH:mm:ss'));
  // }, [datetime]);

  // useEffect(() => {
  //   console.log(getOptions());
  //   console.log(instructorEditing);
  // }, [instructorEditing]);

  const createGymClass = async () => {
    try {
      const body = {
        instructor: instructor[0].id,
        cost: cost,
        datetime: datetime.format('YYYY-MM-DDThh:mm'),
      };
      console.log(JSON.stringify(body));
      const res = await axios.post('/gym_classes/', body);
      if (res.status === 201) {
        if (!alert('gym class created!')) {
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

  const updateGymClass = async () => {
    try {
      const body = {
        instructor: instructorEditing[0].id,
        cost: costEditing,
        datetime: datetimeEditing.format('YYYY-MM-DDThh:mm'),
      };

      console.log(instructorEditing, body);
      // return;

      const res = await axios.put(`/gym_classes/${idEditing}/`, body);
      if (res.status === 200) {
        if (!alert(`class ${idEditing} updated!`)) {
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

  const deleteGymClass = async (id) => {
    console.log('here');
    try {
      const deleteRes = await axios.delete(`/gym_classes/${id}/`);
      if (deleteRes.status === 204) {
        if (!alert(`gym class ${id} deleted`)) {
          window.location.reload();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getGymClasses = async () => {
    const res = await axios.get('/gym_classes/');
    if (res.status === 200 && res.data.length) {
      return res.data;
    }
  };

  const getInstructors = async () => {
    const res = await axios.get('/employees/');
    if (res.status === 200 && res.data.length) {
      return res.data;
    }
  };

  const getAttendance = async () => {
    const res = await axios.get('/attendance/', {
      params: { gym_class: viewingId },
    });
    if (res.status === 200 && res.data.length) {
      let members = []
      for (const obj of res.data) {
        members.push(obj.member)
      }

      console.log(members);
      return members;
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (viewingId) {
        const res = await getAttendance()
        setAttendance(res)
      }
    };
    getData();
  }, [viewingId]);

  useEffect(() => {
    const getData = async () => {
      const gymClassesRes = await getGymClasses();
      const instructorsRes = await getInstructors();
      for (const gymClass of gymClassesRes) {
        gymClass.instructor = { id: gymClass.instructor };
        gymClass.instructor.name = instructorsRes.find(
          (i) => i.id === gymClass.instructor.id
        ).name;
      }
      setGymClasses(gymClassesRes);
      setInstructors(instructorsRes);
    };
    getData();
  }, [display]);

  const show = () => {
    if (display === 'get') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>View Classes</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('post');
                e.currentTarget.blur();
              }}
            >
              Add a Class
            </Button>
          </div>
          <div className={mainStyles.tableHouse}>
            <BootstrapTable columns={columns} data={gymClasses} keyField='id' />
          </div>
        </>
      );
    } else if (display === 'post') {
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Add a Class</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Classes
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                createGymClass();
              }}
            >
              <Row>
                <Form.Group className='mb-3' controlId='referral'>
                  <Form.Label>Instructor</Form.Label>
                  <Typeahead
                    id='basic-typeahead-single'
                    onChange={setInstructor}
                    options={getOptions()}
                    placeholder='Choose an instructor...'
                    selected={instructor}
                  />
                </Form.Group>
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
                <Form.Group className='mb-3' controlId='datetime'>
                  Class time
                  <Datetime
                    onChange={setDatetime}
                    inputProps={{ placeholder: 'Class date and time' }}
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
      return (
        <>
          <div className={mainStyles.topper}>
            <h1>Edit a Class</h1>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Classes
            </Button>
          </div>
          <div style={{ margin: '5%' }}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                updateGymClass();
              }}
            >
              <Row>
                <Form.Group className='mb-3' controlId='referral'>
                  <Form.Label>Instructor</Form.Label>
                  <Typeahead
                    id='basic-typeahead-single'
                    onChange={setInstructorEditing}
                    options={getOptions()}
                    placeholder='Choose an instructor...'
                    selected={instructorEditing}
                  />
                </Form.Group>
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
                <Form.Group className='mb-3' controlId='datetime'>
                  Class time
                  <Datetime
                    onChange={setDatetimeEditing}
                    inputProps={{ placeholder: 'Class date and time' }}
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
    } else if (display === 'view') {
      return (
        <>
          <div className={mainStyles.topper}>
            <div>
            <h1>View Class Attendance</h1>
            <h3>{viewingInstructor}</h3>
            <h3>{viewingDate}</h3>
            </div>
            <Button
              className='btnCustom'
              onClick={(e) => {
                setDisplay('get');
                e.currentTarget.blur();
              }}
            >
              View Classes
            </Button>
          </div>
          <div className={mainStyles.tableHouse}>
            <BootstrapTable columns={viewColumns} data={attendance} keyField='id' />
          </div>
        </>
      );
    }
  };
  return <div className={mainStyles.box}>{show()}</div>;
};

export default Classes;
