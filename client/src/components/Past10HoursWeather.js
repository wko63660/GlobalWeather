// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'

const PastHoursChart = ({ location }) => {
    const WeatherAPIKey = "d4e491ae71ca4fa6aa5165555223004";

    let tempData = {
        label: "Temperature",
        data: [],
        fill: false,
        borderColor: "rgba(75,192,192,1)"
    };

    let humidityData = {
        label: "Humidity",
        data: [],
        fill: false,
        borderColor: "#742774"
    };

    let precpData = {
        label: "Precipitation amount in millimeters",
        data: [],
        fill: false,
        borderColor: "rgba(245, 40, 145, 0.8)"
    };

    let visibilityData = {
        label: "Visibility in km",
        data: [],
        fill: false,
        borderColor: "rgba(150, 28, 255, 0.8)"
    };

    let windKphData = {
        label: "Maximum wind speed",
        data: [],
        fill: false,
        borderColor: "rgba(255, 99, 0, 0.8)"
    };

    let prevDates = [];

    const [data, setData] = useState({
        labels: prevDates,
        datasets: []
    });

    useEffect(() => {
        let yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday = yesterday.toLocaleDateString("en-CA");

        let currentDate = new Date();
        currentDate = currentDate.toLocaleDateString("en-CA");
        fetch("http://api.weatherapi.com/v1/history.json?" + new URLSearchParams({
            key: WeatherAPIKey,
            q: location,
            end_dt: currentDate,
            dt: yesterday
        }))
            .then(res => res.json())
            .then(data => {
                let forecastDates = data.forecast.forecastday;
                let tmpDates = [];
                let targetHour = new Date();
                targetHour.setHours(targetHour.getHours() - 10);
                targetHour = targetHour.getHours();
                let tmpArray = forecastDates[1].hour.slice(0, new Date().getHours() + 1);
                let prevTmpArray = forecastDates[0].hour.slice(14);
                let groupedArray = [...(tmpArray.reverse()), ...(prevTmpArray.reverse())];

                console.log(groupedArray)
                let count = 0;
                for (let info of groupedArray) {

                    let requiredInfo = info;

                    tmpDates.push(info.time.toString() + "(wind drection" + requiredInfo.wind_dir + ")");
                    tempData.data.push(requiredInfo.temp_c);
                    humidityData.data.push(requiredInfo.humidity);
                    precpData.data.push(requiredInfo.precip_mm);
                    visibilityData.data.push(requiredInfo.vis_km);
                    windKphData.data.push(requiredInfo.wind_kph);
                    count++;
                    if (count === 10) break;
                }

                setData(prev => ({
                    ...prev,
                    labels: tmpDates,
                    datasets: [...prev.datasets, tempData, humidityData, precpData, visibilityData, windKphData]
                }));
            });
    }, [location]);

    return <>
        <Line data={data} />
    </>;
}

export default PastHoursChart;
