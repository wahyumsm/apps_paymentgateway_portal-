import React from 'react'
import SubAccountComponent from '../components/SubAccountComponent'
import { useHistory } from 'react-router-dom'
import { getRole } from '../../function/helpers'
import breadcrumbsIcon from "../../assets/icon/breadcrumbs_icon.svg"

const TransferSubAccount = () => {
    const history = useHistory()
    const user_role = getRole()

    function toDashboard() {
        history.push("/");
      }
    
      function toLaporan() {
        history.push("/laporan");
      }
    return (
        <div className='main-content mt-5' style={{ padding: "37px 50px" }}>
            <span className='breadcrumbs-span'>{user_role === "102" ? <span style={{ cursor: "pointer" }} onClick={() => toLaporan()}> Laporan</span> : <span style={{ cursor: "pointer" }} onClick={() => toDashboard()}> Beranda </span>}  &nbsp;<img alt="" src={breadcrumbsIcon} />  &nbsp;Sub Account Bank &nbsp;<img alt="" src={breadcrumbsIcon} /> &nbsp;Transfer</span> 
            <div className="head-title">
                <div className="mt-4 mb-4" style={{ fontFamily: 'Exo', fontSize: 18, fontWeight: 700 }}>Transfer</div>
            </div>
            {/* <SubAccountComponent/> */}
            
        </div>
    )
}

export default TransferSubAccount