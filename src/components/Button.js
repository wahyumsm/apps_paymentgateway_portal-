import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown} from "@fortawesome/free-solid-svg-icons";

export class Button extends React.Component {
    state = {
      value: 12,
      value2: 0
    };
  
    onPlus= () => {
      this.setState({
        value: this.state.value +1
      });
          
    };  
      
    onMinus = () => {
      this.setState({
        value: this.state.value - 1
      });
    };
    
    onPlusMin= () => {
        this.setState({
          value2: this.state.value2 +1
        });
            
    };  
        
    onMinusMin = () => {
        this.setState({
          value2: this.state.value2 - 1
        });
    };
  
    // componentDidMount(){
    //     console.log("Komponen berhasil ditampilkan!")
    // }
      
    // componentDidUpdate(){
    //     console.log("Komponen berhasil di update!")
    // }
  
    // componentWillUnmount(){
    //     console.log("Komponen dihilangkan!")
    // }
  
    render(){
      return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={this.onPlus}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{this.state.value}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={this.onMinus}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
            <div className="mx-3">:</div>
            <div className="counting d-flex flex-column align-items-center">
                <button className="plus text-center" style={{border: "unset", background: "unset"}} onClick={this.onPlusMin}><FontAwesomeIcon icon={faChevronUp} color="#848484" /></button>
                <div type="number" className="count text-center px-2" style={{background: "#F0F0F0", borderRadius: 4}} name="qty">{this.state.value2}</div>
                <button className="minus text-center" style={{border: "unset", background: "unset"}} onClick={this.onMinusMin}><FontAwesomeIcon icon={faChevronDown} color="#848484" /></button>          
            </div>
        </div>
      );
    }
  
  
  }
  
  
  export default Button;