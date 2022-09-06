import axios from 'axios';
import React, { Component } from 'react';
// import Moment from 'moment';
import { Button, Container, Navbar, Form, Row, Col, Card, Modal } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAPI: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: '',
        jabatan: '',
        jenis_kelamin: '',
        tanggal_lahir: ''

      },
      show: false

    }
    this.handleRemove = this.handleRemove.bind(this)
    this.inputChange = this.inputChange.bind(this)
    this.onSubmitForm = this.onSubmitForm.bind(this)
    this.handleModal=this.handleModal.bind(this)
  }


  handleModal() {
    let newDataPost = { ...this.state.dataPost };
    newDataPost['id'] = '';
    newDataPost['nama_karyawan'] = '';
    newDataPost['jabatan'] = '';
    newDataPost['jenis_kelamin'] = '';
    newDataPost['tanggal_lahir'] = ''
    this.setState({ 
      show: !this.state.show,
      dataPost: newDataPost
    });
  }

  getDataId = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then(res => {
      this.setState({
        dataPost: res.data,
        edit: true
      })
    })
  }

  clearData = () => {
    let newDataPost = { ...this.state.dataPost };
    newDataPost['id'] = '';
    newDataPost['nama_karyawan'] = '';
    newDataPost['jabatan'] = '';
    newDataPost['jenis_kelamin'] = '';
    newDataPost['tanggal_lahir'] = ''

    this.setState({
      dataPost: newDataPost
    });
  }

  onSubmitForm() {

    if (this.state.edit === false) {
      axios.post(`http://localhost:3004/data-karyawan`, this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();



      });
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost).then(() => { this.reloadData() });
      this.clearData();
    }
  }

  inputChange(e) {

    let newDataPost = { ...this.state.dataPost };
    if (this.edit === false) {
      newDataPost['id'] = new Date().getTime();
    }
    newDataPost[e.target.name] = e.target.value;
    this.setState({
      dataPost: newDataPost
    }, () => console.log(this.state.dataPost))
  }

  reloadData() {
    axios.get('http://localhost:3004/data-karyawan').then(
      res => {
        this.setState({
          dataAPI: res.data,
          edit: false
        })
      }
    );
  }

  handleRemove(e) {  
    console.log(e.target.value);
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`, { method: 'DELETE' }).then(res => this.reloadData());
    this.setState({
      show:false
      
    })
  }

  

  

  componentDidMount() {
    // fetch('http://localhost:3004/data-karyawan')
    //   .then(response => response.json())
    //   .then(res => {
    //     this.setState({
    //       dataAPI: res
    //     })
    //   })
    this.reloadData();

  }

  render() {
    return (

      <>

        <Navbar bg="light" variant="light" >
          <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://live.staticflickr.com/65535/52339037419_16435085cd_o.png"
              width="50"
              height="40"
              className="d-inline-block align-top"
            />{' '}
          Data Karyawan PT Sidopora
          </Navbar.Brand>
          </Container>
        </Navbar>

        <Container fluid>

          <Row className="justify-content-md-center" style={{ marginTop: '17px' }}>
            <Col>
              <Form.Label>Nama Karyawan</Form.Label>
              <Form.Control value={this.state.dataPost.nama_karyawan} name='nama_karyawan' placeholder="Masukkan Nama" onChange={this.inputChange} />
            </Col>
            <Col>
              <Form.Label>Jabatan</Form.Label>
              <Form.Control value={this.state.dataPost.jabatan} name='jabatan' placeholder="Masukkan Jabatan" onChange={this.inputChange} />
            </Col>
            <Col>
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select value={this.state.dataPost.jenis_kelamin} name='jenis_kelamin' aria-label="Default select example" onChange={this.inputChange}>
                <option>Pilih Jenis Kelamin</option>
                <option value="laki-laki">Laki-Laki</option>
                <option value="perempuan">Perempuan</option>
              </Form.Select>
            </Col>
            <Col>
              <Form.Label >Tanggal Lahir</Form.Label>
              <Form.Control value={this.state.dataPost.tanggal_lahir} type='date' name='tanggal_lahir' placeholder="Masukkan Tanggal" onChange={this.inputChange} />
            </Col>
            <Col>
              <br></br>
              <Button type='submit' variant='primary' onClick={this.onSubmitForm}>Save Data</Button>
            </Col>
          </Row>


          <Row className="justify-content-md-center" style={{ marginTop: '17px' }}>
            {this.state.dataAPI.map((dat, index) => {
              return (
                <Col key={index} style={{ marginTop: '10px' }}>
                  <Card style={{ width: '18rem' }} border='primary'>
                    <Card.Body>
                      <Card.Text>
                        <p>Nama: {dat.nama_karyawan}</p>
                        <p>Jabatan: {dat.jabatan}</p>
                        <p>Jenis Kelamin: {dat.jenis_kelamin}</p>
                        <p>Tanggal Lahir: {dat.tanggal_lahir}</p>
                      
                      </Card.Text>
                      <Button variant="success" value={dat.id} onClick={this.getDataId}>Edit Data</Button>{' '}
                      <Button variant="danger" value={dat.id} onClick={this.handleRemove}>Delete</Button>
                     
                      {/* Menu Modal */}
                     
                      {/* <Modal show={this.state.show}>
                        <Modal.Header >Confirmation</Modal.Header>
                        <Modal.Body>
                          Apakah anda yakin ingin menghapus data ini?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => this.handleModal()} >
                            Batal
                          </Button>
                          <Button variant='danger' value={dat.id} onClick={this.handleRemove} >{dat.id}Hapus</Button>
                        </Modal.Footer>
                      </Modal> */}

                    </Card.Body>
                  </Card>
                </Col>

              )
            }
            )}

          </Row>

        </Container>





      </>

    )
  }
}
export default App;
