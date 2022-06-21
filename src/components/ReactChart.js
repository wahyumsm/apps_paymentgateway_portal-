import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
export const ReactChart = (props) => {	
    const {width, height} = props;

    const data = (canvas) => {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(250,174,50,1)');   
        gradient.addColorStop(1, 'rgba(250,174,50,0)');

        return {
            labels: ["02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00","00:00"],
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ],
                borderWidth: 1
              }]
            // datasets: [
            //     {
            //         backgroundColor : gradient, // Put the gradient here as a fill color
            //         borderColor : "#ff6c23",
            //         borderWidth: 2,
            //         pointColor : "#fff",
            //         pointStrokeColor : "#ff6c23",
            //         pointHighlightFill: "#fff",
            //         pointHighlightStroke: "#ff6c23",
            //         data : [0,0,0,0,0,0,0,0,0,0,0,0]
            //     }
            // ]
        }
    }

    var options = {
        responsive: true,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth : 4,
        scaleLabel : "<%= Number(value).toFixed(0).replace('.', ',') + '°C'%>"
    };

    const divStyle = {
        width: '100%',
        height: 'auto'
    };
    

	return (
        <div className="line-chart" style={divStyle}>
            <Line 
                data={data} 
                options={options}
            />
        </div>
	)
}
