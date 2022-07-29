import { Alert, Form, Table } from '@themesberg/react-bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useHistory } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData'
import { BaseURL, getRole, getToken, setUserSession } from '../../function/helpers'

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
            const listAccessMenu = await axios.post('/Account/GetListMenuAccess', { data: dataParams }, { headers: headers })
            // console.log(listAccessMenu, "ini list access menu");
            if (listAccessMenu.status === 200 && listAccessMenu.data.response_code === 200 && listAccessMenu.data.response_new_token.length === 0) {
                setListAccessMenu(listAccessMenu.data.response_data)
            } else {
                setUserSession(listAccessMenu.data.response_new_token)
                setListAccessMenu(listAccessMenu.data.response_data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleCheck(e, menuName, menuId, details, isAccessValue) {
        console.log(e.target.name, "ini name");
        console.log(menuId, "ini menu id");
        console.log(details, "ini details");
        console.log(isAccessValue, "ini isAccessValue");
        const stringMenuId = menuId.toString()
        // console.log(stringMenuId, "ini string menu id");
        let access = `isAccess${menuName}`
        let insert = `isInsertable${menuName}`
        let update = `isUpdateable${menuName}`
        let deleted = `isDeleteable${menuName}`
        let visibled = `isVisibled${menuName}`
        if (e.target.name === insert && isAccessValue === false || e.target.name === update && isAccessValue === false || e.target.name === deleted && isAccessValue === false || e.target.name === visibled && isAccessValue === false) {
            console.log("masuk access value false");
            alert("Please checked access menu!")
        } else
        if (e.target.name === access && e.target.checked === false && stringMenuId.length === 6 && details === undefined) {
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
                [visibled]: e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 6 && details === undefined) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 4 && details.length !== 0) {
            if (details.length !== 0) {
                details.forEach(el => {
                    let access2 = `isAccess${el.label}`
                    let insert2 = `isInsertable${el.label}`
                    let update2 = `isUpdateable${el.label}`
                    let deleted2 = `isDeleteable${el.label}`
                    let visibled2 = `isVisibled${el.label}`
                    setInputCheck({
                        ...inputCheck,
                        [access]: e.target.checked,
                        [insert]: e.target.checked,
                        [update]: e.target.checked,
                        [deleted]: e.target.checked,
                        [visibled]: e.target.checked,
                        [access2]: e.target.checked,
                        [insert2]: e.target.checked,
                        [update2]: e.target.checked,
                        [deleted2]: e.target.checked,
                        [visibled2]: e.target.checked
                    })
                });
            } else {
                setInputCheck({
                    ...inputCheck,
                    [access]: e.target.checked,
                    [insert]: e.target.checked,
                    [update]: e.target.checked,
                    [deleted]: e.target.checked,
                    [visibled]: e.target.checked
                })
            }
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 4 && details.length === 0) {
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
                [visibled]: e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 4 && details.length !== 0) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 4 && details.length === 0) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 2 && details.length !== 0) {
            if (details.length !== 0) {
                let dataObj = {}
                dataObj[access] = e.target.checked
                dataObj[insert] = e.target.checked
                dataObj[update] = e.target.checked
                dataObj[deleted] = e.target.checked
                dataObj[visibled] = e.target.checked
                details.forEach(el => {
                    let access2 = `isAccess${el.label}`
                    let insert2 = `isInsertable${el.label}`
                    let update2 = `isUpdateable${el.label}`
                    let deleted2 = `isDeleteable${el.label}`
                    let visibled2 = `isVisibled${el.label}`
                    dataObj[access2] = e.target.checked
                    dataObj[insert2] = e.target.checked
                    dataObj[update2] = e.target.checked
                    dataObj[deleted2] = e.target.checked
                    dataObj[visibled2] = e.target.checked
                    if (el.detail !== undefined) {
                        el.detail.forEach(item => {
                            let access3 = `isAccess${item.label}`
                            let insert3 = `isInsertable${item.label}`
                            let update3 = `isUpdateable${item.label}`
                            let deleted3 = `isDeleteable${item.label}`
                            let visibled3 = `isVisibled${item.label}`
                            dataObj[access3] = e.target.checked
                            dataObj[insert3] = e.target.checked
                            dataObj[update3] = e.target.checked
                            dataObj[deleted3] = e.target.checked
                            dataObj[visibled3] = e.target.checked
                        })
                    } else {
                        setInputCheck({
                            ...inputCheck,
                            [access]: e.target.checked,
                            [insert]: e.target.checked,
                            [update]: e.target.checked,
                            [deleted]: e.target.checked,
                            [visibled]: e.target.checked,
                            [access2]: e.target.checked,
                            [insert2]: e.target.checked,
                            [update2]: e.target.checked,
                            [deleted2]: e.target.checked,
                            [visibled2]: e.target.checked
                        })
                    }
                });
                // console.log(dataObj, "ini dataObj");
                if (Object.keys(dataObj).length !== 0) {
                    setInputCheck(dataObj)
                }
            } else {
                setInputCheck({
                    ...inputCheck,
                    [access]: e.target.checked,
                    [insert]: e.target.checked,
                    [update]: e.target.checked,
                    [deleted]: e.target.checked,
                    [visibled]: e.target.checked
                })
            }
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 2 && details.length === 0) {
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
                [visibled]: e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 2 && details.length !== 0) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 2 && details.length === 0) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        }
        else {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        }
    }

    function handleCheckParent(e, listAccessMenu, inputCheckData) {
        console.log(e.target.name, "ini name parent");
        console.log(e.target.checked, "ini checked parent");
        let dataObj = {}
        listAccessMenu.forEach(el => {
            let access = `isAccess${el.label}`
            let insert = `isInsertable${el.label}`
            let update = `isUpdateable${el.label}`
            let deleted = `isDeleteable${el.label}`
            let visibled = `isVisibled${el.label}`
            if (e.target.name === "#" && e.target.checked === false) {
                // console.log("e.target.name === # && e.target.checked === false");
                if (el.detail.length !== 0) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                    dataObj[visibled] = e.target.checked
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        dataObj[access2] = e.target.checked
                        dataObj[insert2] = e.target.checked
                        dataObj[update2] = e.target.checked
                        dataObj[deleted2] = e.target.checked
                        dataObj[visibled2] = e.target.checked
                        if (item.detail !== undefined) {
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                dataObj[access3] = e.target.checked
                                dataObj[insert3] = e.target.checked
                                dataObj[update3] = e.target.checked
                                dataObj[deleted3] = e.target.checked
                                dataObj[visibled3] = e.target.checked
                            })
                        } else {
                            dataObj[access2] = e.target.checked
                            dataObj[insert2] = e.target.checked
                            dataObj[update2] = e.target.checked
                            dataObj[deleted2] = e.target.checked
                            dataObj[visibled2] = e.target.checked
                        }
                    })
                } else {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                    dataObj[visibled] = e.target.checked
                }
            } else if (e.target.name === "#" && e.target.checked === true) {
                // console.log("e.target.name === # && e.target.checked === true");
                if (el.detail.length !== 0 && inputCheckData[insert] === false && inputCheckData[update] === false && inputCheckData[deleted] === false && inputCheckData[visibled] === false) {
                    // console.log("detail tidak nol dan yg lain false");
                    dataObj[access] = e.target.checked
                    dataObj[insert] = false
                    dataObj[update] = false
                    dataObj[deleted] = false
                    dataObj[visibled] = false
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        dataObj[access2] = e.target.checked
                        dataObj[insert2] = false
                        dataObj[update2] = false
                        dataObj[deleted2] = false
                        dataObj[visibled2] = false
                        if (item.detail !== undefined) {
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                dataObj[access3] = e.target.checked
                                dataObj[insert3] = false
                                dataObj[update3] = false
                                dataObj[deleted3] = false
                                dataObj[visibled3] = false
                            })
                        } else {
                            dataObj[access2] = e.target.checked
                            dataObj[insert2] = false
                            dataObj[update2] = false
                            dataObj[deleted2] = false
                            dataObj[visibled2] = false
                        }
                    })
                } else if (el.detail.length === 0 && inputCheckData[insert] === false && inputCheckData[update] === false && inputCheckData[deleted] === false && inputCheckData[visibled] === false) {
                    // console.log("detail nol dan yg lain false");
                    dataObj[access] = e.target.checked
                    dataObj[insert] = false
                    dataObj[update] = false
                    dataObj[deleted] = false
                    dataObj[visibled] = false
                }
            } else if (e.target.name === "accessInsert" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData in false");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessInsert" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData ini true");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData //e.target.checked === true
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === true
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData //e.target.checked === true
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === true
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessUpdate" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData in false");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessUpdate" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData ini true");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData //e.target.checked === true
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === true
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData //e.target.checked === true
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === true
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessDelete" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData in false");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessDelete" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData ini true");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData //e.target.checked === true
                    dataObj[visibled] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === true
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            dataObj[visibled2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                    dataObj[visibled3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                    dataObj[visibled3] = (inputCheckData[visibled3] === undefined) ? item2.is_visibled : inputCheckData[visibled3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            dataObj[visibled2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            dataObj[visibled2] = (inputCheckData[visibled2] === undefined) ? item.is_visibled : inputCheckData[visibled2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData //e.target.checked === true
                    dataObj[visibled] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === true
                    dataObj[visibled] = (inputCheckData[visibled] === undefined) ? el.is_visibled : inputCheckData[visibled]
                }
            } else if (e.target.name === "accessVisible" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData in false");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = e.target.checked //e.target.checked === false
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = e.target.checked //e.target.checked === false
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === false
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = e.target.checked //e.target.checked === false
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = e.target.checked //e.target.checked === false
                }
            } else if (e.target.name === "accessVisible" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                // console.log(accessData, "accessData ini true");
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData //e.target.checked === true
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2 //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2 //e.target.checked === true
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === true
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = e.target.checked //e.target.checked === true
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label}`
                        let insert2 = `isInsertable${item.label}`
                        let update2 = `isUpdateable${item.label}`
                        let deleted2 = `isDeleteable${item.label}`
                        let visibled2 = `isVisibled${item.label}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2 //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label}`
                                let insert3 = `isInsertable${item2.label}`
                                let update3 = `isUpdateable${item2.label}`
                                let deleted3 = `isDeleteable${item2.label}`
                                let visibled3 = `isVisibled${item2.label}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                    dataObj[visibled3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                    dataObj[visibled3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            dataObj[visibled2] = accessData2 //e.target.checked === true
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            dataObj[visibled2] = e.target.checked //e.target.checked === true
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    dataObj[visibled] = accessData //e.target.checked === true
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    dataObj[visibled] = e.target.checked //e.target.checked === true
                }
            }
        })
        // console.log(dataObj, "ini dataObj");
        if (Object.keys(dataObj).length !== 0) {
            setInputCheck(dataObj)
        }
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
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="#" name="#" htmlFor="#" />
                                        </th>
                                        <th>
                                            Access Menu Name
                                        </th>
                                        <th>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Insert" name="accessInsert" htmlFor="accessInsert" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Update" name="accessUpdate" htmlFor="accessUpdate" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Delete" name="accessDelete" htmlFor="accessDelete" />
                                        </th>
                                        <th>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Visible" name="accessVisible" htmlFor="accessVisible" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listAccessMenu.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`]} name={`isAccess${item.label}`} htmlFor={`isAccess${item.label}`} />
                                                    </td>
                                                    <td style={{ fontWeight: 700 }}>
                                                        {item.label}
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map((itemDetail, index) => {
                                                                return (
                                                                    <>
                                                                        <tr key={index}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`]} label={itemDetail.label} name={`isAccess${itemDetail.label}`} htmlFor={`isAccess${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map((itemDetails, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr key={index}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{marginLeft: 20}} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`]} label={itemDetails.label} name={`isAccess${itemDetails.label}`} htmlFor={`isAccess${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isInsertable${item.label}`] === undefined) ? item.is_insertable : inputCheck[`isInsertable${item.label}`]} label={(inputCheck[`isInsertable${item.label}`] === undefined && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label}`] === undefined && item.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${item.label}`] === true && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label}`] === false && item.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${item.label}`] === true && item.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${item.label}`} htmlFor={`isInsertable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                // console.log(itemDetail, "itemDetail insert");
                                                                return (
                                                                    <>
                                                                        <tr key={itemDetail.id}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isInsertable${itemDetail.label}`] === undefined) ? itemDetail.is_insertable : inputCheck[`isInsertable${itemDetail.label}`]} label={(inputCheck[`isInsertable${itemDetail.label}`] === undefined && itemDetail.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetail.label}`] === undefined && itemDetail.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${itemDetail.label}`] === true && itemDetail.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetail.label}`] === false && itemDetail.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${itemDetail.label}`] === true && itemDetail.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${itemDetail.label}`} htmlFor={`isInsertable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr key={itemDetails.id}>
                                                                                                    <td>
                                                                                                        <Form.Check onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isInsertable${itemDetails.label}`] === undefined) ? itemDetails.is_insertable : inputCheck[`isInsertable${itemDetails.label}`]} label={(inputCheck[`isInsertable${itemDetails.label}`] === undefined && itemDetails.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetails.label}`] === undefined && itemDetails.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${itemDetails.label}`] === true && itemDetails.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetails.label}`] === false && itemDetails.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${itemDetails.label}`] === true && itemDetails.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${itemDetails.label}`} htmlFor={`isInsertable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isUpdateable${item.label}`] === undefined) ? item.is_updatable : inputCheck[`isUpdateable${item.label}`]} label={(inputCheck[`isUpdateable${item.label}`] === undefined && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label}`] === undefined && item.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${item.label}`] === true && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label}`] === false && item.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${item.label}`] === true && item.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${item.label}`} htmlFor={`isUpdateable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <tr key={itemDetail.id}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isUpdateable${itemDetail.label}`] === undefined) ? itemDetail.is_updatable : inputCheck[`isUpdateable${itemDetail.label}`]} label={(inputCheck[`isUpdateable${itemDetail.label}`] === undefined && itemDetail.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetail.label}`] === undefined && itemDetail.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${itemDetail.label}`] === true && itemDetail.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetail.label}`] === false && itemDetail.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${itemDetail.label}`] === true && itemDetail.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${itemDetail.label}`} htmlFor={`isUpdateable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr key={itemDetails.id}>
                                                                                                    <td>
                                                                                                        <Form.Check onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isUpdateable${itemDetails.label}`] === undefined) ? itemDetails.is_updatable : inputCheck[`isUpdateable${itemDetails.label}`]} label={(inputCheck[`isUpdateable${itemDetails.label}`] === undefined && itemDetails.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetails.label}`] === undefined && itemDetails.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${itemDetails.label}`] === true && itemDetails.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetails.label}`] === false && itemDetails.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${itemDetails.label}`] === true && itemDetails.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${itemDetails.label}`} htmlFor={`isUpdateable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isDeleteable${item.label}`] === undefined) ? item.is_deletable : inputCheck[`isDeleteable${item.label}`]} label={(inputCheck[`isDeleteable${item.label}`] === undefined && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label}`] === undefined && item.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${item.label}`] === true && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label}`] === false && item.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${item.label}`] === true && item.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${item.label}`} htmlFor={`isDeleteable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <tr key={itemDetail.id}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isDeleteable${itemDetail.label}`] === undefined) ? itemDetail.is_deletable : inputCheck[`isDeleteable${itemDetail.label}`]} label={(inputCheck[`isDeleteable${itemDetail.label}`] === undefined && itemDetail.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetail.label}`] === undefined && itemDetail.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${itemDetail.label}`] === true && itemDetail.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetail.label}`] === false && itemDetail.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${itemDetail.label}`] === true && itemDetail.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${itemDetail.label}`} htmlFor={`isDeleteable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr key={itemDetails.id}>
                                                                                                    <td>
                                                                                                        <Form.Check onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isDeleteable${itemDetails.label}`] === undefined) ? itemDetails.is_deletable : inputCheck[`isDeleteable${itemDetails.label}`]} label={(inputCheck[`isDeleteable${itemDetails.label}`] === undefined && itemDetails.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetails.label}`] === undefined && itemDetails.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${itemDetails.label}`] === true && itemDetails.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetails.label}`] === false && itemDetails.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${itemDetails.label}`] === true && itemDetails.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${itemDetails.label}`} htmlFor={`isDeleteable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isVisibled${item.label}`] === undefined) ? item.is_visibled : inputCheck[`isVisibled${item.label}`]} label={(inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === false && item.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${item.label}`} htmlFor={`isVisibled${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <tr key={itemDetail.id}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isVisibled${itemDetail.label}`] === undefined) ? itemDetail.is_visibled : inputCheck[`isVisibled${itemDetail.label}`]} label={(inputCheck[`isVisibled${itemDetail.label}`] === undefined && itemDetail.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetail.label}`] === undefined && itemDetail.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${itemDetail.label}`] === true && itemDetail.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetail.label}`] === false && itemDetail.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${itemDetail.label}`] === true && itemDetail.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${itemDetail.label}`} htmlFor={`isVisibled${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <tr key={itemDetails.id}>
                                                                                                    <td>
                                                                                                        <Form.Check onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isVisibled${itemDetails.label}`] === undefined) ? itemDetails.is_visibled : inputCheck[`isVisibled${itemDetails.label}`]} label={(inputCheck[`isVisibled${itemDetails.label}`] === undefined && itemDetails.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetails.label}`] === undefined && itemDetails.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${itemDetails.label}`] === true && itemDetails.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetails.label}`] === false && itemDetails.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${itemDetails.label}`] === true && itemDetails.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${itemDetails.label}`} htmlFor={`isVisibled${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
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