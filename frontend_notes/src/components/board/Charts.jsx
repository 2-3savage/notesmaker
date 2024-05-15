import React, { useContext, useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Line, Bar, Pie  } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import AuthContext from '../context/AuthContext';
import { en_language, ru_language } from '../../services/language';
const Charts = ({ listBoards, boards, user }) => {
    let {authTokens, setFavoritePages, language} = useContext(AuthContext)
    const [ lang, setLang ] = useState(language === "Русский" ? ru_language : en_language);
    useEffect(() => {
        setLang(language === "Русский" ? ru_language : en_language);
    }, [language]) 
    let countNull = 0;
    let countComplete = 0;
    let countTimeExpired = 0;
    let countTimeSoon = 0;
    let countTimeNotSoon = 0;
    const getDate = (datepicker) => {
        if (!datepicker) return
        if (datepicker.complete) return lang.done // Зеленный
        const now = new Date().getTime()
        const end = new Date(datepicker.date).getTime()
        const timeDiff = end - now
        if (timeDiff < 0 && timeDiff > -86400 * 1000) {
            return lang.expired
        }
        if (timeDiff < -86400 * 1000) {
            return lang.expired// Красный
        }
        if (timeDiff < 86400 * 1000 && timeDiff > 0) {
            return lang.deadline_expire // Желтый
        } 
        return lang.deadline_not_soon
    }
    boards.forEach(board => {
        countNull += board.table.filter(item => item.datepicker === null).length;
        countComplete += board.table.filter(item => getDate(item.datepicker) === lang.done).length
        countTimeExpired += board.table.filter(item => getDate(item.datepicker) === lang.expired).length
        countTimeSoon += board.table.filter(item => getDate(item.datepicker) === lang.deadline_expire).length
        countTimeNotSoon += board.table.filter(item => getDate(item.datepicker) === lang.deadline_not_soon).length
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
            label: lang.сards,
            borderColor: "#3333ff",
            backgroundColor: "#9FADBC",
            fill: true
          },
        
        ]
      };
    const barChartData2 = {
        labels: [lang.done, lang.deadline_not_soon, lang.deadline_expire, lang.expired, lang.no_dedline],
        datasets: [
            {
            data: [countComplete, countTimeNotSoon, countTimeSoon, countTimeExpired, countNull],
            label: lang.сards,
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
            label: lang.сards,
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
            label: lang.сards,
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
                {lang.cards_table}
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
                {lang.cards_dedline}
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
                {lang.cards_members}
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
                {lang.cards_tags}
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


