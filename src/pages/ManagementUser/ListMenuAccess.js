import { Form, Table } from '@themesberg/react-bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData'
import { BaseURL, getRole, getToken } from '../../function/helpers'

function ListMenuAccess() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const [userId, setUserId] = useState(101)
    const [listAccessMenu, setListAccessMenu] = useState([])
    const [inputCheck, setInputCheck] = useState({})

    async function getListAccessMenu(userId) {
        try {
            const auth = "Bearer " + getToken()
            const dataParams = encryptData(`{"muser_id":"${userId}"}`)
            const headers = {
                'Content-Type':'application/json',
                'Authorization' : auth
            }
            const listAccessMenu = await axios.post(BaseURL + '/Account/GetListMenuAccess', { data: dataParams }, { headers: headers })
            // console.log(listAccessMenu, "ini list access menu");
            if (listAccessMenu.status === 200 && listAccessMenu.data.response_code === 200 && listAccessMenu.data.response_new_token.length === 0) {
                setListAccessMenu(listAccessMenu.data.response_data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleCheck(e, menuName) {
        // console.log(e.target, "ini checked");
        if (e.target.name === `isAccess${menuName}`) {
            let access = `isAccess${menuName}`
            let insert = `isInsertable${menuName}`
            let update = `isUpdateable${menuName}`
            let deleted = `isDeleteable${menuName}`
            let visibled = `isVisibled${menuName}`
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
                [visibled]: e.target.checked
            })
        } else {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        }
    }

    function handleCheckParent(e) {
        console.log(e.target, "ini checked parent");
    }

    useEffect(() => {
        if (!access_token) {
            // RouteTo("/login")
            history.push('/login');
        }
        if (user_role === 102) {
            history.push('/404');
        }
        getListAccessMenu(userId)
    }, [access_token, user_role, userId])
    
    
    const columns = [
        {
            name: 'Access Menu Name',
            selector: row => row.label,
        },
        {
            name: 'Access Insert',
            selector: row => row.is_insertable,
            cell: (row) => <div style={{ textDecoration: "underline", color: "#077E86" }} >{row.is_insertable}</div>
        },
        {
            name: 'Access Update',
            selector: row => row.is_updatable,
        },
        {
            name: 'Access Delete',
            selector: row => row.is_deletable,
        },
    ]

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
    // setInputCheck(listAccessMenu)
    // let listAccessMenuDinamis;
    console.log(listAccessMenu, "ini list access menu di luar function");
    console.log(inputCheck, "ini input check di luar function 1");

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'>Beranda  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Access Menu User</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Access User</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='base-content mt-3'>
                        <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span>
                        <div className='div-table'>
                            {/* <DataTable
                                columns={columns}
                                customStyles={customStyles}
                                data={listAccessMenu}
                                selectableRows
                            /> */}
                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            <Form.Check onChange={handleCheckParent} label="Access Menu Name" name="accessMenuName" htmlFor="accessMenuName" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={handleCheckParent} label="Access Insert" name="accessInsert" htmlFor="accessInsert" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={handleCheckParent} label="Access Update" name="accessUpdate" htmlFor="accessUpdate" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={handleCheckParent} label="Access Delete" name="accessDelete" htmlFor="accessDelete" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={handleCheckParent} label="Access Visible" name="accessVisible" htmlFor="accessVisible" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listAccessMenu.map((item, index) => {
                                            // let isInsertable = "isInsertable" + (index + 1)
                                            // console.log(item, "item");
                                            // console.log(item.is_insertable, "item.is_insertable");
                                            // item.is_deletable = false
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label)} checked={(inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`]} label={item.label} name={`isAccess${item.label}`} htmlFor={`isAccess${item.label}`} />
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label)} checked={(inputCheck[`isInsertable${item.label}`] === undefined) ? item.is_insertable : inputCheck[`isInsertable${item.label}`]} label={(inputCheck[`isInsertable${item.label}`] === undefined && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label}`] === undefined && item.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${item.label}`] === true && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label}`] === false && item.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${item.label}`] === true && item.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${item.label}`} htmlFor={`isInsertable${item.label}`} />
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label)} checked={(inputCheck[`isUpdateable${item.label}`] === undefined) ? item.is_updatable : inputCheck[`isUpdateable${item.label}`]} label={(inputCheck[`isUpdateable${item.label}`] === undefined && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label}`] === undefined && item.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${item.label}`] === true && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label}`] === false && item.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${item.label}`] === true && item.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${item.label}`} htmlFor={`isUpdateable${item.label}`} />
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label)} checked={(inputCheck[`isDeleteable${item.label}`] === undefined) ? item.is_deletable : inputCheck[`isDeleteable${item.label}`]} label={(inputCheck[`isDeleteable${item.label}`] === undefined && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label}`] === undefined && item.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${item.label}`] === true && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label}`] === false && item.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${item.label}`] === true && item.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${item.label}`} htmlFor={`isDeleteable${item.label}`} />
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label)} checked={(inputCheck[`isVisibled${item.label}`] === undefined) ? item.is_visibled : inputCheck[`isVisibled${item.label}`]} label={(inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === false && item.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${item.label}`} htmlFor={`isVisibled${item.label}`} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    
}

export default ListMenuAccess