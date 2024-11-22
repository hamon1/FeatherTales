import React from 'react';

import { addDiaryEntry } from '../api';

const Calendar = () => {
    const pushCalendarData = async() => {
        const token = sessionStorage.getItem('token');
        const diaryEntry = {
            date: new Date(Date.now()),
            notes: '@@@생일!',
            todos: [
                {
                    text: '알고리즘 공부',
                    completed: false,
                    priority: 'high',
                }
            ],
            schedule: [
                {
                    title: '기말고사',
                    startTime: new Date(Date.now()),
                    endTime: new Date(Date.now() + 60 * 60 * 1000 * 2),
                    location: '강의실',
                    description: '기말고사 2시. 공6 609호',
                }
            ]
        };

        await addDiaryEntry(token, diaryEntry)
           .then(() => {
                console.log('Diary entry added successfully');
            })
           .catch((error) => {
                console.error('Failed to add diary entry', error.response.data.msg);
            });
    }

    return (
        <div>
            <h1>Calendar Page</h1>
            <button onClick={pushCalendarData}>text Calendar input</button>
        </div>
    )
}

export default Calendar;