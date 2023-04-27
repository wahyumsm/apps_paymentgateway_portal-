import { Alert, Form, Row, Table } from '@themesberg/react-bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Link, useHistory, useParams } from 'react-router-dom'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"
import encryptData from '../../function/encryptData'
import { BaseURL, errorCatch, getRole, getToken, setUserSession } from '../../function/helpers'
import { data } from 'jquery'

function ListMenuAccess() {

    const history = useHistory()
    const access_token = getToken()
    const user_role = getRole()
    const { userId } = useParams()
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
            const listAccessMenu = await axios.post(BaseURL + "/Account/GetListMenuAccess", { data: dataParams }, { headers: headers })
            if (listAccessMenu.status === 200 && listAccessMenu.data.response_code === 200 && listAccessMenu.data.response_new_token.length === 0) {
                setListAccessMenu(listAccessMenu.data.response_data)
            } else if (listAccessMenu.status === 200 && listAccessMenu.data.response_code === 200 && listAccessMenu.data.response_new_token.length !== 0) {
                setUserSession(listAccessMenu.data.response_new_token)
                setListAccessMenu(listAccessMenu.data.response_data)
            }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    async function saveAccessMenu(dataObj, userId, listAccess) {
        try {
            // console.log(dataObj, "dataObj");
            // console.log(userId, "userId");
            // console.log(listAccess, "listAccess");
            let obj = {
                maccessuser_user_id: userId,
                accUser: []
            }
            let newObj = {}
            userId = parseInt(userId)
                listAccess.forEach(item => {
                    let access = `isAccess${item.label+item.id}`
                    let insert = `isInsertable${item.label+item.id}`
                    let update = `isUpdateable${item.label+item.id}`
                    let deleted = `isDeleteable${item.label+item.id}`
                    if ((dataObj[access] === true && item.detail.length !== 0) || (dataObj[access] === undefined && dataObj[access] === undefined && item.is_access === true && item.detail.length !== 0)) {
                        newObj.maccessuser_access_id = item.id
                        newObj.maccessuser_is_insertable = (dataObj[insert] !== undefined) ? dataObj[insert] : item.is_insertable
                        newObj.maccessuser_is_updatable = (dataObj[update] !== undefined) ? dataObj[update] : item.is_updatable
                        newObj.maccessuser_is_deletable = (dataObj[deleted] !== undefined) ? dataObj[deleted] : item.is_deletable
                        obj.accUser.push(newObj)
                        newObj = {}
                        item.detail.forEach(item2 => {
                            let access2 = `isAccess${item2.label+item2.id}`
                            let insert2 = `isInsertable${item2.label+item2.id}`
                            let update2 = `isUpdateable${item2.label+item2.id}`
                            let deleted2 = `isDeleteable${item2.label+item2.id}`
                            if ((dataObj[access2] === true && item2.detail.length !== 0) || (dataObj[access2] === undefined && item2.is_access === true && item2.detail.length !== 0)) {
                                newObj.maccessuser_access_id = item2.id
                                newObj.maccessuser_is_insertable = (dataObj[insert2] !== undefined) ? dataObj[insert2] : item2.is_insertable
                                newObj.maccessuser_is_updatable = (dataObj[update2] !== undefined) ? dataObj[update2] : item2.is_updatable
                                newObj.maccessuser_is_deletable = (dataObj[deleted2] !== undefined) ? dataObj[deleted2] : item2.is_deletable
                                obj.accUser.push(newObj)
                                newObj = {}
                                item2.detail.forEach(item3 => {
                                    let access3 = `isAccess${item3.label+item3.id}`
                                    let insert3 = `isInsertable${item3.label+item3.id}`
                                    let update3 = `isUpdateable${item3.label+item3.id}`
                                    let deleted3 = `isDeleteable${item3.label+item3.id}`
                                    if ((dataObj[access3] === true) || (dataObj[access3] === undefined && item3.is_access === true)) {
                                        newObj.maccessuser_access_id = item3.id
                                        newObj.maccessuser_is_insertable = (dataObj[insert3] !== undefined) ? dataObj[insert3] : item3.is_insertable
                                        newObj.maccessuser_is_updatable = (dataObj[update3] !== undefined) ? dataObj[update3] : item3.is_updatable
                                        newObj.maccessuser_is_deletable = (dataObj[deleted3] !== undefined) ? dataObj[deleted3] : item3.is_deletable
                                        obj.accUser.push(newObj)
                                        newObj = {}
                                    }
                                })
                            } else if ((dataObj[access2] === true && item2.detail.length === 0) || (dataObj[access2] === undefined && item2.is_access === true && item2.detail.length === 0)) {
                                newObj.maccessuser_access_id = item2.id
                                newObj.maccessuser_is_insertable = (dataObj[insert2] !== undefined) ? dataObj[insert2] : item2.is_insertable
                                newObj.maccessuser_is_updatable = (dataObj[update2] !== undefined) ? dataObj[update2] : item2.is_updatable
                                newObj.maccessuser_is_deletable = (dataObj[deleted2] !== undefined) ? dataObj[deleted2] : item2.is_deletable
                                obj.accUser.push(newObj)
                                newObj = {}
                            }
                        })
                    } else if ((dataObj[access] === true && item.detail.length === 0) || (dataObj[access] === undefined && item.is_access === true && item.detail.length === 0)) {
                        newObj.maccessuser_access_id = item.id
                        newObj.maccessuser_is_insertable = (dataObj[insert] !== undefined) ? dataObj[insert] : item.is_insertable
                        newObj.maccessuser_is_updatable = (dataObj[update] !== undefined) ? dataObj[update] : item.is_updatable
                        newObj.maccessuser_is_deletable = (dataObj[deleted] !== undefined) ? dataObj[deleted] : item.is_deletable
                        obj.accUser.push(newObj)
                        newObj = {}
                    }
                })
                    const auth = "Bearer " + getToken()
                    const dataParams = encryptData(JSON.stringify(obj))
                    const headers = {
                        'Content-Type':'application/json',
                        'Authorization' : auth
                    }
                    const saveAccess = await axios.post(BaseURL + "/Account/SaveAccess", {data: dataParams}, {headers: headers})
                    if (saveAccess.status === 200 && saveAccess.data.response_code === 200 && saveAccess.data.response_new_token.length === 0) {
                        alert("Access Menu berhasil disimpan")
                        history.push("/managementuser")
                    } else if (saveAccess.status === 200 && saveAccess.data.response_code === 200 && saveAccess.data.response_new_token.length !== 0) {
                        setUserSession(saveAccess.data.response_new_token)
                        alert("Access Menu berhasil disimpan")
                        history.push("/managementuser")
                    }
        } catch (error) {
            // console.log(error)
            history.push(errorCatch(error.response.status))
        }
    }

    function handleCheck(e, menuName, menuId, details, item, isAccessValue) {
        const stringMenuId = menuId.toString()
        let access = `isAccess${menuName+stringMenuId}`
        let insert = `isInsertable${menuName+stringMenuId}`
        let update = `isUpdateable${menuName+stringMenuId}`
        let deleted = `isDeleteable${menuName+stringMenuId}`
        if (e.target.name === insert && isAccessValue === false || e.target.name === update && isAccessValue === false || e.target.name === deleted && isAccessValue === false) {
            alert("Please checked access menu!")
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 6 && details === undefined) {
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
            })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 6 && details === undefined) {
            setInputCheck({
                ...inputCheck,
                [e.target.name] : e.target.checked
            })
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 4) {
            if (details.length !== 0) {
                details.forEach(el => {
                    let access2 = `isAccess${el.label+el.id}`
                    let insert2 = `isInsertable${el.label+el.id}`
                    let update2 = `isUpdateable${el.label+el.id}`
                    let deleted2 = `isDeleteable${el.label+el.id}`
                    // let visibled2 = `isVisibled${el.label}`
                    setInputCheck({
                        ...inputCheck,
                        [access]: e.target.checked,
                        [insert]: e.target.checked,
                        [update]: e.target.checked,
                        [deleted]: e.target.checked,
                        // [visibled]: e.target.checked,
                    })
                    setInputCheck({
                        [access2]: e.target.checked,
                        [insert2]: e.target.checked,
                        [update2]: e.target.checked,
                        [deleted2]: e.target.checked,
                        // [visibled2]: e.target.checked
                    })
                });
            } else {
                setInputCheck({
                    ...inputCheck,
                    [access]: e.target.checked,
                    [insert]: e.target.checked,
                    [update]: e.target.checked,
                    [deleted]: e.target.checked,
                    // [visibled]: e.target.checked
                })
            }
        // } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 4 && details.length === 0) {
        //     setInputCheck({
        //         ...inputCheck,
        //         [access]: e.target.checked,
        //         [insert]: e.target.checked,
        //         [update]: e.target.checked,
        //         [deleted]: e.target.checked,
        //         // [visibled]: e.target.checked
        //     })
        } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 4) {
            if (details.length !== 0) {
                setInputCheck({
                    ...inputCheck,
                    [e.target.name] : e.target.checked
                })
            } else {
                setInputCheck({
                    ...inputCheck,
                    [e.target.name] : e.target.checked
                })
            }
        // } else if (e.target.name === access && e.target.checked === true && stringMenuId.length === 4 && details.length === 0) {
        //     setInputCheck({
        //         ...inputCheck,
        //         [e.target.name] : e.target.checked
        //     })
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 2 && details.length !== 0) {
            let dataObj = {}
            listAccessMenu.forEach(item => {
                let access1 = `isAccess${item.label+item.id}`
                let insert1 = `isInsertable${item.label+item.id}`
                let update1 = `isUpdateable${item.label+item.id}`
                let deleted1 = `isDeleteable${item.label+item.id}`
                if (details.length !== 0 && access !== access1) {
                    dataObj[access1] = (inputCheck[access1] === undefined) ? item.is_access : inputCheck[access1]
                    dataObj[insert1] = (inputCheck[insert1] === undefined) ? item.is_insertable : inputCheck[insert1]
                    dataObj[update1] = (inputCheck[update1] === undefined) ? item.is_updatable : inputCheck[update1]
                    dataObj[deleted1] = (inputCheck[deleted1] === undefined) ? item.is_deletable : inputCheck[deleted1]
                    item.detail.forEach(item2 => {
                        let access2 = `isAccess${item2.label+item2.id}`
                        let insert2 = `isInsertable${item2.label+item2.id}`
                        let update2 = `isUpdateable${item2.label+item2.id}`
                        let deleted2 = `isDeleteable${item2.label+item2.id}`
                        dataObj[access2] = (inputCheck[access2] === undefined) ? item.is_access : inputCheck[access2]
                        dataObj[insert2] = (inputCheck[insert2] === undefined) ? item.is_insertable : inputCheck[insert2]
                        dataObj[update2] = (inputCheck[update2] === undefined) ? item.is_updatable : inputCheck[update2]
                        dataObj[deleted2] = (inputCheck[deleted2] === undefined) ? item.is_deletable : inputCheck[deleted2]
                        if (item2.detail.length !== 0) {
                            item2.detail.forEach(item3 => {
                                let access3 = `isAccess${item3.label+item3.id}`
                                let insert3 = `isInsertable${item3.label+item3.id}`
                                let update3 = `isUpdateable${item3.label+item3.id}`
                                let deleted3 = `isDeleteable${item3.label+item3.id}`
                                dataObj[access3] = (inputCheck[access3] === undefined) ? item.is_access : inputCheck[access3]
                                dataObj[insert3] = (inputCheck[insert3] === undefined) ? item.is_insertable : inputCheck[insert3]
                                dataObj[update3] = (inputCheck[update3] === undefined) ? item.is_updatable : inputCheck[update3]
                                dataObj[deleted3] = (inputCheck[deleted3] === undefined) ? item.is_deletable : inputCheck[deleted3]
                            })
                        }
                    })
                } else if (details.length !== 0 && access === access1) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                    item.detail.forEach(item2 => {
                        let access2 = `isAccess${item2.label+item2.id}`
                        let insert2 = `isInsertable${item2.label+item2.id}`
                        let update2 = `isUpdateable${item2.label+item2.id}`
                        let deleted2 = `isDeleteable${item2.label+item2.id}`
                        dataObj[access2] = e.target.checked
                        dataObj[insert2] = e.target.checked
                        dataObj[update2] = e.target.checked
                        dataObj[deleted2] = e.target.checked
                        if (item2.detail.length !== 0) {
                            item2.detail.forEach(item3 => {
                                let access3 = `isAccess${item3.label+item3.id}`
                                let insert3 = `isInsertable${item3.label+item3.id}`
                                let update3 = `isUpdateable${item3.label+item3.id}`
                                let deleted3 = `isDeleteable${item3.label+item3.id}`
                                dataObj[access3] = e.target.checked
                                dataObj[insert3] = e.target.checked
                                dataObj[update3] = e.target.checked
                                dataObj[deleted3] = e.target.checked
                            })
                        }
                    })
                } else if (details.length === 0 && access !== access1) {
                    dataObj[access1] = (inputCheck[access1] === undefined) ? item.is_access : inputCheck[access1]
                    dataObj[insert1] = (inputCheck[insert1] === undefined) ? item.is_insertable : inputCheck[insert1]
                    dataObj[update1] = (inputCheck[update1] === undefined) ? item.is_updatable : inputCheck[update1]
                    dataObj[deleted1] = (inputCheck[deleted1] === undefined) ? item.is_deletable : inputCheck[deleted1]
                } else if (details.length === 0 && access === access1) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                }
            })
            if (Object.keys(dataObj).length !== 0) {
                // console.log(dataObj, "dataObj");
                setInputCheck(dataObj)
            }
        } else if (e.target.name === access && e.target.checked === false && stringMenuId.length === 2 && details.length === 0) {
            setInputCheck({
                ...inputCheck,
                [access]: e.target.checked,
                [insert]: e.target.checked,
                [update]: e.target.checked,
                [deleted]: e.target.checked,
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
        let dataObj = {}
        listAccessMenu.forEach(el => {
            let access = `isAccess${el.label+el.id}`
            let insert = `isInsertable${el.label+el.id}`
            let update = `isUpdateable${el.label+el.id}`
            let deleted = `isDeleteable${el.label+el.id}`
            if (e.target.name === "#" && e.target.checked === false) {
                if (el.detail.length !== 0) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        dataObj[access2] = e.target.checked
                        dataObj[insert2] = e.target.checked
                        dataObj[update2] = e.target.checked
                        dataObj[deleted2] = e.target.checked
                        if (item.detail !== undefined) {
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                dataObj[access3] = e.target.checked
                                dataObj[insert3] = e.target.checked
                                dataObj[update3] = e.target.checked
                                dataObj[deleted3] = e.target.checked
                            })
                        } else {
                            dataObj[access2] = e.target.checked
                            dataObj[insert2] = e.target.checked
                            dataObj[update2] = e.target.checked
                            dataObj[deleted2] = e.target.checked
                        }
                    })
                } else {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = e.target.checked
                    dataObj[update] = e.target.checked
                    dataObj[deleted] = e.target.checked
                }
            } else if (e.target.name === "#" && e.target.checked === true) {
                if (el.detail.length !== 0 && (inputCheckData[insert] === false || inputCheckData[insert] === undefined) && (inputCheckData[update] === false || inputCheckData[update] === undefined) && (inputCheckData[deleted] === false || inputCheckData[deleted] === undefined)) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert] //false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        dataObj[access2] = e.target.checked
                        dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2] // false
                        dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                        dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        if (item.detail !== undefined) {
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                dataObj[access3] = e.target.checked
                                dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3] //false
                                dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_insertable : inputCheckData[update3]
                                dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_insertable : inputCheckData[deleted3]
                            })
                        } else {
                            dataObj[access2] = e.target.checked
                            dataObj[insert2] = false
                            dataObj[update2] = false
                            dataObj[deleted2] = false
                        }
                    })
                } else if (el.detail.length === 0 && (inputCheckData[insert] === false || inputCheckData[insert] === undefined) && (inputCheckData[update] === false || inputCheckData[update] === undefined) && (inputCheckData[deleted] === false || inputCheckData[deleted] === undefined)) {
                    dataObj[access] = e.target.checked
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert] //false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                }
            } else if (e.target.name === "accessInsert" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === false
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === false
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === false
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                }
            } else if (e.target.name === "accessInsert" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData //e.target.checked === true
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === true
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3 //e.target.checked === true
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = e.target.checked //e.target.checked === true
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2 //e.target.checked === true
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = e.target.checked //e.target.checked === true
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData //e.target.checked === true
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = e.target.checked //e.target.checked === true
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                }
            } else if (e.target.name === "accessUpdate" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === false
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === false
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === false
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                }
            } else if (e.target.name === "accessUpdate" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData //e.target.checked === true
                    dataObj[deleted] = accessData
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === true
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3 //e.target.checked === true
                                    dataObj[deleted3] = accessData3
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = e.target.checked //e.target.checked === true
                                    dataObj[deleted3] = (inputCheckData[deleted3] === undefined) ? item2.is_deletable : inputCheckData[deleted3]
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2 //e.target.checked === true
                            dataObj[deleted2] = accessData2
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = e.target.checked //e.target.checked === true
                            dataObj[deleted2] = (inputCheckData[deleted2] === undefined) ? item.is_deletable : inputCheckData[deleted2]
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData //e.target.checked === true
                    dataObj[deleted] = accessData
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = e.target.checked //e.target.checked === true
                    dataObj[deleted] = (inputCheckData[deleted] === undefined) ? el.is_deletable : inputCheckData[deleted]
                }
            } else if (e.target.name === "accessDelete" && e.target.checked === false) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === false
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === false
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === false
                }
            } else if (e.target.name === "accessDelete" && e.target.checked === true) {
                let accessData = (inputCheckData[access] === undefined) ? el.is_access : inputCheckData[access]
                if (el.detail.length !== 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData //e.target.checked === true
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === false && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail !== undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === false && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail === undefined && accessData === false && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                        } else if (item.detail === undefined && accessData === false && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                        }
                    })
                } else if (el.detail.length !== 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === true
                    el.detail.forEach(item => {
                        let access2 = `isAccess${item.label+item.id}`
                        let insert2 = `isInsertable${item.label+item.id}`
                        let update2 = `isUpdateable${item.label+item.id}`
                        let deleted2 = `isDeleteable${item.label+item.id}`
                        let accessData2 = (inputCheckData[access2] === undefined) ? item.is_access : inputCheckData[access2]
                        if (item.detail !== undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === true && accessData2 === false && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail !== undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                            item.detail.forEach(item2 => {
                                let access3 = `isAccess${item2.label+item2.id}`
                                let insert3 = `isInsertable${item2.label+item2.id}`
                                let update3 = `isUpdateable${item2.label+item2.id}`
                                let deleted3 = `isDeleteable${item2.label+item2.id}`
                                let accessData3 = (inputCheckData[access3] === undefined) ? item2.is_access : inputCheckData[access3]
                                if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === false) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = accessData3
                                    dataObj[update3] = accessData3
                                    dataObj[deleted3] = accessData3 //e.target.checked === true
                                } else if (item.detail !== undefined && accessData === true && accessData2 === true && accessData3 === true) {
                                    dataObj[access3] = accessData3
                                    dataObj[insert3] = (inputCheckData[insert3] === undefined) ? item2.is_insertable : inputCheckData[insert3]
                                    dataObj[update3] = (inputCheckData[update3] === undefined) ? item2.is_updatable : inputCheckData[update3]
                                    dataObj[deleted3] = e.target.checked //e.target.checked === true
                                }
                            })
                        } else if (item.detail === undefined && accessData === true && accessData2 === false) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = accessData2
                            dataObj[update2] = accessData2
                            dataObj[deleted2] = accessData2 //e.target.checked === true
                        } else if (item.detail === undefined && accessData === true && accessData2 === true) {
                            dataObj[access2] = accessData2
                            dataObj[insert2] = (inputCheckData[insert2] === undefined) ? item.is_insertable : inputCheckData[insert2]
                            dataObj[update2] = (inputCheckData[update2] === undefined) ? item.is_updatable : inputCheckData[update2]
                            dataObj[deleted2] = e.target.checked //e.target.checked === true
                        }
                    })
                } else if (el.detail.length === 0 && accessData === false) {
                    dataObj[access] = accessData
                    dataObj[insert] = accessData
                    dataObj[update] = accessData
                    dataObj[deleted] = accessData //e.target.checked === true
                } else if (el.detail.length === 0 && accessData === true) {
                    dataObj[access] = accessData
                    dataObj[insert] = (inputCheckData[insert] === undefined) ? el.is_insertable : inputCheckData[insert]
                    dataObj[update] = (inputCheckData[update] === undefined) ? el.is_updatable : inputCheckData[update]
                    dataObj[deleted] = e.target.checked //e.target.checked === true
                }
            }
        })
        if (Object.keys(dataObj).length !== 0) {
            setInputCheck(dataObj)
        }
    }

    useEffect(() => {
        if (!access_token) {
            history.push('/login');
        }
        if (user_role === "102") {
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

    return (
        <div className="content-page mt-6">
            <span className='breadcrumbs-span'><Link to={"/"}>Beranda</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;<Link to={"/managementuser"}>Management User</Link>  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Access Menu User</span>
            <div className='head-title'>
                <h2 className="h5 mb-3 mt-4">Access User</h2>
            </div>
            <div className='main-content'>
                <div className='riwayat-dana-masuk-div mt-4'>
                    <div className='base-content mt-3'>
                        {/* <span className='font-weight-bold mb-4' style={{fontWeight: 600}}>Filter</span> */}
                        <div className='div-table' style={{ paddingBottom: 20, marginBottom: 20 }}>
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
                                        <th style={{ fontSize: 13, verticalAlign: "baseline" }}>
                                            Access Menu Name
                                        </th>
                                        <th style={{ fontSize: 13 }}>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Insert" name="accessInsert" htmlFor="accessInsert" />
                                        </th>
                                        <th style={{ fontSize: 13 }}>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Update" name="accessUpdate" htmlFor="accessUpdate" />
                                        </th>
                                        <th style={{ fontSize: 13 }}>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Delete" name="accessDelete" htmlFor="accessDelete" />
                                        </th>
                                        {/* <th style={{ fontSize: 13 }}>
                                            <Form.Check onChange={(e) => handleCheckParent(e, listAccessMenu, inputCheck)} label="Access Visible" name="accessVisible" htmlFor="accessVisible" />
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listAccessMenu.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, item, (inputCheck[`isAccess${item.label+item.id}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label+item.id}`])} checked={(inputCheck[`isAccess${item.label+item.id}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label+item.id}`]} name={`isAccess${item.label+item.id}`} htmlFor={`isAccess${item.label}`} />
                                                    </td>
                                                    <td style={{ fontSize: 16, fontWeight: 700, fontFamily: "Exo" }}>
                                                        {item.label}
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map((itemDetail, index) => {
                                                                return (
                                                                    <>
                                                                        <Row key={index} style={{ margin: "10px 0px 5px" }}>
                                                                            <td>
                                                                                <Form.Check onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, itemDetail, (inputCheck[`isAccess${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label+itemDetail.id}`])} checked={(inputCheck[`isAccess${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label+itemDetail.id}`]} label={itemDetail.label} name={`isAccess${itemDetail.label+itemDetail.id}`} htmlFor={`isAccess${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map((itemDetails, index) => {
                                                                                        return (
                                                                                            <>
                                                                                                <Row key={index} style={{ margin: "10px 0px 5px" }}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{marginLeft: 20}} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, itemDetails, (inputCheck[`isAccess${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label+itemDetails.id}`])} checked={(inputCheck[`isAccess${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label+itemDetails.id}`]} label={itemDetails.label} name={`isAccess${itemDetails.label+itemDetails.id}`} htmlFor={`isAccess${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </Row>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </Row>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, item, (inputCheck[`isAccess${item.label+item.id}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label+item.id}`])} checked={(inputCheck[`isInsertable${item.label+item.id}`] === undefined) ? item.is_insertable : inputCheck[`isInsertable${item.label+item.id}`]} label={(inputCheck[`isInsertable${item.label+item.id}`] === undefined && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label+item.id}`] === undefined && item.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${item.label+item.id}`] === true && item.is_insertable) ? "Granted" : (inputCheck[`isInsertable${item.label+item.id}`] === false && item.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${item.label+item.id}`] === true && item.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${item.label+item.id}`} htmlFor={`isInsertable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <Row key={itemDetail.id} style={{ margin: "10px 0px 5px" }}>
                                                                            <td>
                                                                                <Form.Check style={{ marginLeft: -12 }} onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, itemDetail, (inputCheck[`isAccess${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label+itemDetail.id}`])} checked={(inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_insertable : inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`]} label={(inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === false && itemDetail.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${itemDetail.label+itemDetail.id}`} htmlFor={`isInsertable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <Row key={itemDetails.id} style={{ margin: "10px 0px 5px" }}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{ marginLeft: -24 }} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, itemDetails, (inputCheck[`isAccess${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label+itemDetails.id}`])} checked={(inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_insertable : inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`]} label={(inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_insertable === false) ? "Disabled" : (inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_insertable) ? "Granted" : (inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === false && itemDetails.is_insertable) ? "Disabled" : (inputCheck[`isInsertable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_insertable === false) ? "Granted" : "Disabled"} name={`isInsertable${itemDetails.label+itemDetails.id}`} htmlFor={`isInsertable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </Row>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </Row>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, item, (inputCheck[`isAccess${item.label+item.id}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label+item.id}`])} checked={(inputCheck[`isUpdateable${item.label+item.id}`] === undefined) ? item.is_updatable : inputCheck[`isUpdateable${item.label+item.id}`]} label={(inputCheck[`isUpdateable${item.label+item.id}`] === undefined && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label+item.id}`] === undefined && item.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${item.label+item.id}`] === true && item.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${item.label+item.id}`] === false && item.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${item.label+item.id}`] === true && item.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${item.label+item.id}`} htmlFor={`isUpdateable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <Row key={itemDetail.id} style={{ margin: "10px 0px 5px" }}>
                                                                            <td>
                                                                                <Form.Check style={{ marginLeft: -12 }} onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, itemDetail, (inputCheck[`isAccess${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label+itemDetail.id}`])} checked={(inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_updatable : inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`]} label={(inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === false && itemDetail.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${itemDetail.label+itemDetail.id}`} htmlFor={`isUpdateable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <Row key={itemDetails.id} style={{ margin: "10px 0px 5px" }}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{ marginLeft: -24 }} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, itemDetails, (inputCheck[`isAccess${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label+itemDetails.id}`])} checked={(inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_updatable : inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`]} label={(inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_updatable === false) ? "Disabled" : (inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_updatable) ? "Granted" : (inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === false && itemDetails.is_updatable) ? "Disabled" : (inputCheck[`isUpdateable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_updatable === false) ? "Granted" : "Disabled"} name={`isUpdateable${itemDetails.label+itemDetails.id}`} htmlFor={`isUpdateable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </Row>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </Row>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, item, (inputCheck[`isAccess${item.label+item.id}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label+item.id}`])} checked={(inputCheck[`isDeleteable${item.label+item.id}`] === undefined) ? item.is_deletable : inputCheck[`isDeleteable${item.label+item.id}`]} label={(inputCheck[`isDeleteable${item.label+item.id}`] === undefined && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label+item.id}`] === undefined && item.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${item.label+item.id}`] === true && item.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${item.label+item.id}`] === false && item.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${item.label+item.id}`] === true && item.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${item.label+item.id}`} htmlFor={`isDeleteable${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <Row key={itemDetail.id} style={{ margin: "10px 0px 5px" }}>
                                                                            <td>
                                                                                <Form.Check style={{ marginLeft: -12 }} onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, itemDetail, (inputCheck[`isAccess${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label+itemDetail.id}`])} checked={(inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === undefined) ? itemDetail.is_deletable : inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`]} label={(inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === undefined && itemDetail.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === false && itemDetail.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${itemDetail.label+itemDetail.id}`] === true && itemDetail.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${itemDetail.label+itemDetail.id}`} htmlFor={`isDeleteable${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <Row key={itemDetails.id} style={{ margin: "10px 0px 5px" }}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{ marginLeft: -24 }} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, itemDetails, (inputCheck[`isAccess${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label+itemDetails.id}`])} checked={(inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === undefined) ? itemDetails.is_deletable : inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`]} label={(inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === undefined && itemDetails.is_deletable === false) ? "Disabled" : (inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_deletable) ? "Granted" : (inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === false && itemDetails.is_deletable) ? "Disabled" : (inputCheck[`isDeleteable${itemDetails.label+itemDetails.id}`] === true && itemDetails.is_deletable === false) ? "Granted" : "Disabled"} name={`isDeleteable${itemDetails.label+itemDetails.id}`} htmlFor={`isDeleteable${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </Row>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </Row>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td>
                                                    {/* <td>
                                                        <Form.Check onChange={(e) => handleCheck(e, item.label, item.id, item.detail, (inputCheck[`isAccess${item.label}`] === undefined) ? item.is_access : inputCheck[`isAccess${item.label}`])} checked={(inputCheck[`isVisibled${item.label}`] === undefined) ? item.is_visibled : inputCheck[`isVisibled${item.label}`]} label={(inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === undefined && item.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled) ? "Granted" : (inputCheck[`isVisibled${item.label}`] === false && item.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${item.label}`] === true && item.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${item.label}`} htmlFor={`isVisibled${item.label}`} />
                                                        {
                                                            item.detail.length !== 0 ?
                                                            item.detail.map(itemDetail => {
                                                                return (
                                                                    <>
                                                                        <Row key={itemDetail.id} style={{ margin: "10px 0px 5px" }}>
                                                                            <td>
                                                                                <Form.Check style={{ marginLeft: -12 }} onChange={(e) => handleCheck(e, itemDetail.label, itemDetail.id, itemDetail.detail, (inputCheck[`isAccess${itemDetail.label}`] === undefined) ? itemDetail.is_access : inputCheck[`isAccess${itemDetail.label}`])} checked={(inputCheck[`isVisibled${itemDetail.label}`] === undefined) ? itemDetail.is_visibled : inputCheck[`isVisibled${itemDetail.label}`]} label={(inputCheck[`isVisibled${itemDetail.label}`] === undefined && itemDetail.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetail.label}`] === undefined && itemDetail.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${itemDetail.label}`] === true && itemDetail.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetail.label}`] === false && itemDetail.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${itemDetail.label}`] === true && itemDetail.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${itemDetail.label}`} htmlFor={`isVisibled${itemDetail.label}`} />
                                                                                {
                                                                                    itemDetail.detail.length !== 0 ?
                                                                                    itemDetail.detail.map(itemDetails => {
                                                                                        return (
                                                                                            <>
                                                                                                <Row key={itemDetails.id} style={{ margin: "10px 0px 5px" }}>
                                                                                                    <td>
                                                                                                        <Form.Check style={{ marginLeft: -24 }} onChange={(e) => handleCheck(e, itemDetails.label, itemDetails.id, itemDetails.detail, (inputCheck[`isAccess${itemDetails.label}`] === undefined) ? itemDetails.is_access : inputCheck[`isAccess${itemDetails.label}`])} checked={(inputCheck[`isVisibled${itemDetails.label}`] === undefined) ? itemDetails.is_visibled : inputCheck[`isVisibled${itemDetails.label}`]} label={(inputCheck[`isVisibled${itemDetails.label}`] === undefined && itemDetails.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetails.label}`] === undefined && itemDetails.is_visibled === false) ? "Disabled" : (inputCheck[`isVisibled${itemDetails.label}`] === true && itemDetails.is_visibled) ? "Granted" : (inputCheck[`isVisibled${itemDetails.label}`] === false && itemDetails.is_visibled) ? "Disabled" : (inputCheck[`isVisibled${itemDetails.label}`] === true && itemDetails.is_visibled === false) ? "Granted" : "Disabled"} name={`isVisibled${itemDetails.label}`} htmlFor={`isVisibled${itemDetails.label}`} />
                                                                                                    </td>
                                                                                                </Row>
                                                                                            </>
                                                                                        )
                                                                                    }) : null
                                                                                }
                                                                            </td>
                                                                        </Row>
                                                                    </>
                                                                )
                                                            }) : null
                                                        }
                                                    </td> */}
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                            <div style={{ display: "flex", justifyContent: "end", marginTop: 16, marginRight: -15, width: "unset", padding: "0px 15px" }}>
                                <button onClick={() => saveAccessMenu(inputCheck, userId, listAccessMenu)} className='add-button'>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    
}

export default ListMenuAccess