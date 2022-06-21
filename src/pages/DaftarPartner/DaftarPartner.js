import React from 'react'
import '../../components/css/global.css'
import DataTable from 'react-data-table-component';
import { Col, Row, Button, Dropdown, ButtonGroup, InputGroup, Form} from '@themesberg/react-bootstrap';
import { invoiceItems } from '../../data/tables';
function DaftarPartner() {

    const columns = [
        {
            name: 'No',
            selector: row => row.id
        },
        {
            name: 'ID Partner',
            selector: row => row.description,
            sortable: true
        },
        {
            name: 'Nama Perusahaan',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Email Perusahaan',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'No. Telepon',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.quantity,
            width: "100px",
            cell:(row) =>
            <>
                {row.partner_status === 1 ? <div className='active-status-badge'>Active</div> : <div className='inactive-status-badge'>Inactive</div>}
            </>,
            sortable: true
        },
        {
          name: 'Action',
          width: "230px",
        //   cell:(row) => 
        //     <>
        //     <img alt="" src={DeleteIcon} onClick={() => openDeleteModal(row.partner_id)}/>&nbsp;&nbsp;&nbsp;&nbsp;
        //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, true)}>Ubah</span>&nbsp;&nbsp;&nbsp;&nbsp;
        //     <span style={{color: '#DB1F26', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => navigateDetailPartner(row.partner_id, false)}>Detail</span>
        //     </>,
          ignoreRowClick: true,
          allowOverflow: true,
          button: true
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px'
            },
        },
    };

  return (
    <div className='main-content' style={{padding: "37px 27px 37px 27px"}}>
        <div className="head-title">
          <h2 className="h4 mt-5 mb-5">Daftar Partner</h2>
        </div>
        <div className='base-content'>   
            <div className='search-bar mb-5'>
                <Row>
                    <Col xs={3} style={{width: '18%'}}>
                        <span className='h5'>
                            Cari Data Partner :
                        </span>
                    </Col>
                    <Col xs={2}>
                        <Form.Control
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            style={{marginTop: '-10px'}}
                            />
                    </Col>
                </Row>
            </div>
            <div className="div-table">
                <DataTable
                    columns={columns}
                    data={invoiceItems}
                    customStyles={customStyles}
                    pagination
                />
            </div>
        </div>
    </div>
  )
}

export default DaftarPartner