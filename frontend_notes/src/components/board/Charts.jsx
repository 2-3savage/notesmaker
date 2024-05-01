import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie  } from "react-chartjs-2";
import Chart from 'chart.js/auto';
const Charts = ({ listBoards, boards, user }) => {
    let countNull = 0;
    let countComplete = 0;
    let countTimeExpired = 0;
    let countTimeSoon = 0;
    let countTimeNotSoon = 0;
    const getDate = (datepicker) => {
        if (!datepicker) return
        if (datepicker.complete) return "Выполнено" // Зеленный
        const now = new Date().getTime()
        const end = new Date(datepicker.date).getTime()
        const timeDiff = end - now
        if (timeDiff < 0 && timeDiff > -86400 * 1000) {
            return "Просрочен"
        }
        if (timeDiff < -86400 * 1000) {
            return "Просрочен" // Красный
        }
        if (timeDiff < 86400 * 1000 && timeDiff > 0) {
            return "Срок истекает" // Желтый
        } 
        return "Истекает не скоро"
    }
    boards.forEach(board => {
        countNull += board.table.filter(item => item.datepicker === null).length;
        countComplete += board.table.filter(item => getDate(item.datepicker) === "Выполнено").length
        countTimeExpired += board.table.filter(item => getDate(item.datepicker) === "Просрочен").length
        countTimeSoon += board.table.filter(item => getDate(item.datepicker) === "Срок истекает").length
        countTimeNotSoon += board.table.filter(item => getDate(item.datepicker) === "Истекает не скоро").length
    });
    const userCounts = {};
    user.forEach(u => {
        const count = boards.reduce((acc, board) => {
            return acc + board.table.filter(item => item.members.some(member => member.id === u.id)).length;
        }, 0);
        userCounts[u.username] = count;
    });
    const userItemCountsValue = Object.values(userCounts);
    const userItemCountsKeys = Object.keys(userCounts);
    const tagCounts = {};
    listBoards.tags.forEach(tag => {
        const count = boards.reduce((acc, board) => {
            return acc + board.table.filter(item => item.tag.some(tag_2 => tag_2.id === tag.id)).length;
        }, 0);
        tagCounts[tag.text] = count;
    })
    const tagItemCountsValue = Object.values(tagCounts);
    const tagItemCountsKeys = Object.keys(tagCounts);
    const barChartData = {
        labels: boards.map(board => board.title),
        datasets: [
          {
            data: boards.map(board => board.table.length),
            label: "Карточек",
            borderColor: "#3333ff",
            backgroundColor: "#9FADBC",
            fill: true
          },
        
        ]
      };
    const barChartData2 = {
        labels: ["Выполнено", 'Истекает не скоро', 'Срок истекает', 'Просрочен', 'Без срока'],
        datasets: [
            {
            data: [countComplete, countTimeNotSoon, countTimeSoon, countTimeExpired, countNull],
            label: "Карточек",
            borderColor: "#3333ff",
            backgroundColor: "#9FADBC",
            fill: true
            },
        ]
    };  
    const barChartData3 = {
        labels:  userItemCountsKeys,
        datasets: [
            {
            data: userItemCountsValue,
            label: "Карточек",
            borderColor: "#3333ff",
            backgroundColor: "#9FADBC",
            fill: true
            },
        ]
    };  
    const barChartData4 = {
        labels: tagItemCountsKeys,
        datasets: [
            {
            data: tagItemCountsValue,
            label: "Карточек",
            borderColor: "#3333ff",
            backgroundColor: "#9FADBC",
            fill: true
            },
        ]
    };  
  return(
    <div className='tables_static'>
        <div className='static_table'>
            <span className='span_bar'>
                Карточки по колонкам
            </span>
            <div className='static_table_bar'>
                <Bar
                    type="bar"
                    className='bar'
                    data={barChartData}
                />
            </div>
            
        </div>
        <div className='static_table'>
            <span className='span_bar'>
                Карточки по дате выполнения
            </span>
            <div className='static_table_bar'>
                <Bar
                    type="bar"
                    className='bar'
                    data={barChartData2}
                />
            </div>
        </div>
        <div className='static_table'>
        <span className='span_bar'>
                Карточки по участникам
            </span>
            <div className='static_table_bar'>
                <Bar
                    type="bar"
                    className='bar'
                    data={barChartData3}
                />
            </div>
        </div>
        <div className='static_table'>
            <span className='span_bar'>
                Карточки по меткам
            </span>
            <div className='static_table_bar'>
                <Bar
                    type="bar"
                    className='bar'
                    data={barChartData4}
                />
            </div>
        </div>
        
    </div>
    
    
  )
};

export default Charts


