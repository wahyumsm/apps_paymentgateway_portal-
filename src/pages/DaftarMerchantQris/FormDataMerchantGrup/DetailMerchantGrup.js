import React, { useMemo, useState } from 'react'
import breadcrumbsIcon from "../../../assets/icon/breadcrumbs_icon.svg";
import Foto1 from "../../../assets/icon/file_dummy_qris.svg";
import $ from 'jquery'
import { Col, Image, OverlayTrigger, Row, Tooltip } from '@themesberg/react-bootstrap';
import alertIconYellow from '../../../assets/icon/note_icon_grey.svg'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { agenLists } from '../../../data/tables';
import { FilterComponentQrisSettlementMerchant } from '../../../components/FilterComponentQris';
import loadingEzeelink from "../../../assets/img/technologies/Double Ring-1s-303px.svg"

const DetailMerchantGrup = () => {
    const [isMerchantQris, setIsMerchantQris] = useState(true)
    function disbursementTabs(isTabs){
        if(isTabs === true){
            setIsMerchantQris(isTabs)
            $('#infoMerchant').addClass('menu-detail-akun-hr-active')
            $('#infoMerchantspan').addClass('menu-detail-akun-span-active')
            $('#settlementMerchant').removeClass('menu-detail-akun-hr-active')
            $('#settlementMerchantspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsMerchantQris(isTabs)
            $('#infoMerchant').removeClass('menu-detail-akun-hr-active')
            $('#infoMerchantspan').removeClass('menu-detail-akun-span-active')
            $('#settlementMerchant').addClass('menu-detail-akun-hr-active')
            $('#settlementMerchantspan').addClass('menu-detail-akun-span-active')
        }
    }

    const columnsBrand = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID merchant',
            selector: row => row.IDAgen,
        },
        {
            name: 'Waktu terdaftar',
            selector: row => row.IDAgen,
        },
        {
            name: 'Nama brand', 
            selector: row => row.namaAgen,
            wrap: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
        {
            name: 'Aksi',
            cell: (row) => (
                <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Lanjutkan daftar</div></Tooltip>}>
                    <FontAwesomeIcon icon={faPencilAlt} className="me-2" style={{cursor: "pointer"}} />
                </OverlayTrigger>
                // <OverlayTrigger placement="top" trigger={["hover", "focus"]} overlay={ <Tooltip ><div className="text-center">Lihat</div></Tooltip>}>
                //     <FontAwesomeIcon icon={faEye} className="mx-2" style={{cursor: "pointer"}} /></OverlayTrigger>
                // </OverlayTrigger>
              ),
        },
    ];

    const [filterTextBrand, setFilterTextBrand] = React.useState('');
    const [resetPaginationToggleBrand, setResetPaginationToggleBrand] = React.useState(false);
    const filteredItemsBrand = agenLists.filter(
        item => item.namaAgen && item.namaAgen.toLowerCase().includes(filterTextBrand.toLowerCase()),
    );
    const subHeaderComponentMemoBrand = useMemo(() => {
        const handleClear = () => {
            if (filterTextBrand) {
                setResetPaginationToggleBrand(!resetPaginationToggleBrand);
                setFilterTextBrand('');
            }
        };
        return (
            <FilterComponentQrisSettlementMerchant onFilter={e => setFilterTextBrand(e.target.value)} onClear={handleClear} filterText={filterTextBrand} title="Pencarian :" placeholder="Masukkan nama brand" />
        );	}, [filterTextBrand, resetPaginationToggleBrand]
    );

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#F2F2F2',
                border: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                paddingRight: 'none'
                
            },
        },
    };

    const CustomLoader = () => (
        <div style={{ padding: '24px' }}>
          <Image className="loader-element animate__animated animate__jackInTheBox" src={loadingEzeelink} height={80} />
          <div>Loading...</div>
        </div>
    );

    return (
        <div className="main-content mt-5" style={{padding: "37px 27px 37px 27px"}}>
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar merchant</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Detail merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Detail merchant grup</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="infoMerchant" onClick={() => disbursementTabs(true)}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="infoMerchantspan">Info merchant</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="settlementMerchant" onClick={() => disbursementTabs(false)}>
                    <span className='menu-detail-akun-span' id="settlementMerchantspan">Settlement merchant</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isMerchantQris === true ? (
                    <div className='base-content' style={{ marginTop: -15 }}>
                        <div className="waktu-bergabung-detail">Waktu bergabung : 12   April 2023, 18:12</div>
                        <div className="nama-merchant-in-detail mt-2">Garuda Grup</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>ID pengguna</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Kata sandi</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>12345abcde</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>sad12i3ui</Col>
                        </Row>
                        <hr/>
                        <div className='title-sub-content-detail-merchant'>Info pemilik</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Nomor eKTP pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Rian Kusnaedi</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>012345678901234</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Peran pendaftar</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Kewarganegaraan pemilik usaha</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Pemilik usaha/Direktur</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>Warga Negara Indonesia</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>No telepon pemilik usaha</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Foto eKTP pemilik usaha sesuai akta pendirian/perubahan terakhir</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>08XXXXXXXXXX</Col>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                        </Row>
                        <hr/>
                        <div className='title-sub-content-detail-merchant'>Info usaha</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Nama perusahaan</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Bentuk perusahaan</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>PT Tunas Bersih</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>Perseroan terbatas (PT.)</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Kategori usaha</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Jumlah kasir (counter pembayaran)</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Makanan dan minuman</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>3</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Pendapatan pertahun</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Alamat usaha</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Rp 2,5 miliar - Rp 50 miliar</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>Jln. mahkota no.01 RT.01 RW.02, DKI Jakarta, Jakarta Pusat, Gambir, Petojo Utara</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Kode pos</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Jenis toko</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>12345</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>Toko Fisik</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Sudah pernah mendaftar QRIS ?</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Foto tempat usaha</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Tidak</Col>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                        </Row>
                        <hr/>
                        <div className='title-sub-content-detail-merchant'>Dokumen usaha</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Dokumen NPWP perusahaan</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Dokumen NIB perusahaan</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Akta pendirian perusahaan atau perubahan terakhir</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>SK Kementerian Kehakiman</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                            <Col xs={6} className='d-flex justify-content-start align-items-center'>
                                <img src={Foto1} alt="foto 1" />
                                <div className='isi-content-detail-merchant ms-2'>foto1.jpg</div>
                            </Col>
                        </Row>
                        <div className='text-end mt-3'>
                            <button className='button-ubah-info-merchant-detail'>
                                Ubah info merchant
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='base-content' style={{ marginTop: -15 }}>
                        <div className='title-sub-content-detail-merchant'>Info settlement</div>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Jenis settlement</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Tujuan transfer settlement</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Settlement otomatis</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>Rekening grup</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Nama bank</Col>
                            <Col xs={6} className='sub-title-detail-merchant'>Nomor rekening</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Bank Central Asia (BCA)</Col>
                            <Col xs={6} className='isi-content-detail-merchant'>0123456789012</Col>
                        </Row>
                        <Row className='mt-3'>
                            <Col xs={6} className='sub-title-detail-merchant'>Nama pemilik rekening</Col>
                        </Row>
                        <Row className='mt-1'>
                            <Col xs={6} className='isi-content-detail-merchant'>Rian Kusnaedi</Col>
                        </Row>
                        <hr/>
                        <div className='title-sub-content-detail-merchant'>Daftar settlement</div>
                        <div className='alert-form-info-pemilik py-4 mt-3'>
                            <img src={alertIconYellow} alt="icon" />
                            <div className='ms-2'>Jika ingin mendaftarkan settlement dengan “Upload dokumen”, Kamu bisa menggunakan format dokumen excel yang sudah disediakan: <span style={{ color: "#077E86", fontFamily: "Exo", fontWeight: 700, cursor: "pointer", textDecorationLine: "underline" }}>Download template.</span></div>
                        </div>
                        <div className="div-table mt-4" >
                            <DataTable
                                columns={columnsBrand}
                                data={filteredItemsBrand}
                                customStyles={customStyles}
                                pagination
                                highlightOnHover
                                // progressPending={pending}
                                paginationResetDefaultPage={resetPaginationToggleBrand}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoBrand}
                                persistTableHead
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DetailMerchantGrup