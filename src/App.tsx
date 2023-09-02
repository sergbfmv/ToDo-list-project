import React, {useRef, useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";

export type FilterValuesType = 'all' | 'active' | 'completed'

function App() {

    let [tasks, setTasks] = useState([
        {id: v1(), title: 'CSS&HTML', isDone: true},
        {id: v1(), title: 'JS', isDone: true},
        {id: v1(), title: 'React', isDone: false},
        {id: v1(), title: 'Redux', isDone: false},
        {id: v1(), title: 'MaterialUI', isDone: false},
    ])

    const [filter, setFilter] = useState<FilterValuesType>('all')
    const newTitle = useRef<HTMLInputElement>(null)

    const removeTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id))
    }

    const addTask = () => {
        if (newTitle.current) {
            const newTask = {id: v1(), title: newTitle.current.value, isDone: false}
            setTasks([newTask, ...tasks])
            newTitle.current.value = ''
        }

    }

    const changeFilter = (value: FilterValuesType) => {
        setFilter(value)
    }

    const filteredTasks = () => {
        switch (filter) {
            case 'active':
                return tasks.filter(i => !i.isDone)
            case 'completed':
                return tasks.filter(i => i.isDone)
            default:
                return tasks
        }
    }

    // const filterTasks = (title: ButtonNameType) => {
    //     setFilteredButton(title)
    // }

    // let filteredTasks = tasks
    //
    // if (filteredButton === 'active') {
    //     filteredTasks = tasks.filter(i => !i.isDone)
    // }
    // if (filteredButton === 'completed') {
    //     filteredTasks = tasks.filter(i => i.isDone)
    // }

    return (
        <div className="App">
            <Todolist
                title='What to learn'
                tasks={filteredTasks()}
                removeTask={removeTask}
                addTask={addTask}
                changeFilter={changeFilter}
                newTitle={newTitle}
            />
        </div>
    );
}

export default App;
