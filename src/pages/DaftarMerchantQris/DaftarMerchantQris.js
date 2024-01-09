import React, { useMemo, useState } from 'react'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg";
import $ from 'jquery'
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Image, OverlayTrigger, Tooltip } from '@themesberg/react-bootstrap';
import { agenLists } from '../../data/tables';
import loadingEzeelink from "../../assets/img/technologies/Double Ring-1s-303px.svg"
import { FilterComponentQrisBrand, FilterComponentQrisGrup, FilterComponentQrisOutlet } from '../../components/FilterComponentQris';

const DaftarMerchantQris = () => {
    const [isMerchantQris, setIsMerchantQris] = useState("merchantGrup")
    function disbursementTabs(isTabs){
        if(isTabs === "merchantGrup"){
            setIsMerchantQris(isTabs)
            $('#merchantGrup').addClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').addClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else if (isTabs === "merchantBrand") {
            setIsMerchantQris(isTabs)
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').addClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').addClass('menu-detail-akun-span-active')
            $('#merchantOutlet').removeClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').removeClass('menu-detail-akun-span-active')
        } else {
            setIsMerchantQris(isTabs)
            $('#merchantGrup').removeClass('menu-detail-akun-hr-active')
            $('#merchantGrupspan').removeClass('menu-detail-akun-span-active')
            $('#merchantBrand').removeClass('menu-detail-akun-hr-active')
            $('#merchantBrandspan').removeClass('menu-detail-akun-span-active')
            $('#merchantOutlet').addClass('menu-detail-akun-hr-active')
            $('#merchantOutletspan').addClass('menu-detail-akun-span-active')
        }
    }

    const [pending, setPending] = useState(true)
    const [filterTextGrup, setFilterTextGrup] = React.useState('');
    const [resetPaginationToggleGrup, setResetPaginationToggleGrup] = React.useState(false);
    const filteredItemsGrup = agenLists.filter(
        item => item.namaAgen && item.namaAgen.toLowerCase().includes(filterTextGrup.toLowerCase()),
    );
    const subHeaderComponentMemoGrup = useMemo(() => {
        const handleClear = () => {
            if (filterTextGrup) {
                setResetPaginationToggleGrup(!resetPaginationToggleGrup);
                setFilterTextGrup('');
            }
        };
        return (
            <FilterComponentQrisGrup onFilter={e => setFilterTextGrup(e.target.value)} onClear={handleClear} filterText={filterTextGrup} title="Pencarian :" placeholder="Masukkan nama grup" />
        );	}, [filterTextGrup, resetPaginationToggleGrup]
    );

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
            <FilterComponentQrisBrand onFilter={e => setFilterTextBrand(e.target.value)} onClear={handleClear} filterText={filterTextBrand} title="Pencarian :" placeholder="Masukkan nama brand" />
        );	}, [filterTextBrand, resetPaginationToggleBrand]
    );

    const [filterTextOutlet, setFilterTextOutlet] = React.useState('');
    const [resetPaginationToggleOutlet, setResetPaginationToggleOutlet] = React.useState(false);
    const filteredItemsOutlet = agenLists.filter(
        item => item.namaAgen && item.namaAgen.toLowerCase().includes(filterTextOutlet.toLowerCase()),
    );
    const subHeaderComponentMemoOutlet = useMemo(() => {
        const handleClear = () => {
            if (filterTextOutlet) {
                setResetPaginationToggleOutlet(!resetPaginationToggleOutlet);
                setFilterTextOutlet('');
            }
        };
        return (
            <FilterComponentQrisOutlet onFilter={e => setFilterTextOutlet(e.target.value)} onClear={handleClear} filterText={filterTextOutlet} title="Pencarian :" placeholder="Masukkan nama outlet" />
        );	}, [filterTextOutlet, resetPaginationToggleOutlet]
    );

    const columnsGrup = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID merchant',
            selector: row => row.IDAgen,
            width: "130px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.IDAgen,
            width: "170px"
        },
        {
            name: 'Nama merchant', 
            selector: row => row.namaAgen,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.email,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
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

    const columnsBrand = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID merchant',
            selector: row => row.IDAgen,
            width: "130px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.IDAgen,
            width: "170px"
        },
        {
            name: 'Nama grup', 
            selector: row => row.namaAgen,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Nama brand', 
            selector: row => row.namaAgen,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.email,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
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

    const columnsOutlet = [
        {
            name: 'No',
            selector: row => row.id,
            width: '67px'
        },
        {
            name: 'ID merchant',
            selector: row => row.IDAgen,
            width: "130px"
        },
        {
            name: 'Waktu bergabung',
            selector: row => row.IDAgen,
            width: "170px"
        },
        {
            name: 'Nama outlet', 
            selector: row => row.namaAgen,
            wrap: true,
            width: "160px"
        },
        {
            name: 'Tujuan settlement',
            selector: row => row.email,
            wrap: true,
            width: "180px"
        },
        {
            name: 'Status',
            selector: row => row.status,
            width: "150px",
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
            <span className='breadcrumbs-span'><span style={{ cursor: "pointer" }}>Beranda</span> &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;<span style={{ cursor: "pointer" }}>Daftar Merchant</span></span>
            <div className="head-title"> 
                <h2 className="h5 mt-3" style={{ fontFamily: "Exo", fontSize: 16, fontWeight: 600 }}>Daftar Merchant</h2>
            </div>
            <div className='detail-akun-menu mt-4' style={{display: 'flex', height: 33}}>
                <div className='detail-akun-tabs menu-detail-akun-hr-active' id="merchantGrup" onClick={() => disbursementTabs("merchantGrup")}>
                    <span className='menu-detail-akun-span menu-detail-akun-span-active' id="merchantGrupspan">Merchant grup</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantBrand" onClick={() => disbursementTabs("merchantBrand")}>
                    <span className='menu-detail-akun-span' id="merchantBrandspan">Merchant brand</span>
                </div>
                <div className='detail-akun-tabs' style={{marginLeft: 15}} id="merchantOutlet" onClick={() => disbursementTabs("merchantOutlet")}>
                    <span className='menu-detail-akun-span' id="merchantOutletspan">Merchant outlet</span>
                </div>
            </div>
            <hr className='hr-style' style={{marginTop: -2}}/>
            {
                isMerchantQris === "merchantGrup" ? (
                    <div className='base-content positiion-relative'>
                        <div className="div-table" style={{ marginBottom: 500 }}>
                            <DataTable
                                columns={columnsGrup}
                                data={filteredItemsGrup}
                                customStyles={customStyles}
                                pagination
                                highlightOnHover
                                // progressPending={pending}
                                paginationResetDefaultPage={resetPaginationToggleGrup}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoGrup}
                                persistTableHead
                            />
                        </div>
                    </div>
                ) : isMerchantQris === "merchantBrand" ? (
                    <div className='base-content positiion-relative'>
                        <div className="div-table" style={{ marginBottom: 500 }}>
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
                ) : (
                    <div className='base-content positiion-relative'>
                        <div className="div-table" style={{ marginBottom: 500 }}>
                            <DataTable
                                columns={columnsOutlet}
                                data={filteredItemsOutlet}
                                customStyles={customStyles}
                                pagination
                                highlightOnHover
                                // progressPending={pending}
                                paginationResetDefaultPage={resetPaginationToggleOutlet}
                                progressComponent={<CustomLoader />}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemoOutlet}
                                persistTableHead
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DaftarMerchantQris