import randomColor from 'randomcolor';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { v4 } from 'uuid';
import './App.css'

const App = () => {
	function rand(min, max) {
		return Math.random() * (max - min) + min;
	}

	const [text, setText] = useState('');
	const [tasks, setTasks] = useState(
		JSON.parse(localStorage.getItem('todos')) || []
	);

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(tasks))
	}, [tasks]);

	const inputRef = useRef();

	const newTask = (e) => {
		if (text.trim() !== '') {
			let coords = e.target.getBoundingClientRect();
			let randX = rand(5, window.innerWidth - coords.width);
			let randY = rand(-50, -window.innerHeight - coords.height);

			if (window.innerHeight - Math.abs(randY) < 5) {
				randY = -window.innerHeight - 100;
			};

			const newItem = {
				id: v4(),
				text,
				color: randomColor({
					luminosity: 'light'
				}),
				defaultPos: {
					x: randX,
					y: randY
				},
			}
			setTasks((tasks) => [...tasks, newItem])
			setText('');
		}

		inputRef.current.placeholder = "Plz enter something here";

		setTimeout(() => {
			inputRef.current.placeholder = "Enter something...";
		}, 2000);
	}

	const removeTasks = () => {
		localStorage.clear()
		setTasks((tasks) => tasks = []);
	}

	const deleteNode = (id) => {
		setTasks(tasks.filter(task => task.id !== id));
	}

	const updatePos = (data, index) => {
		let newArr = [...tasks];
		newArr[index].defaultPos = { x: data.x, y: data.y };
		setTasks(newArr);
	}

	const onKeyPress = (e) => {
		if (e.key === 'Enter') {
			newTask(e)
		};
	}

	return (
		<div className="App">
			<div className="wrapper">
				<input
					value={text}
					ref={inputRef}
					type="text"
					placeholder='Enter something...'
					onChange={e => setText(e.currentTarget.value)}
					onKeyDown={onKeyPress} />
				<button className='btn btn--enter' onClick={newTask}>ENTER</button>
				<button className='btn btn--delete' onClick={removeTasks}>X</button>
			</div>

			{
				tasks.map((task, index) => {
					return (
						<Draggable
							key={index}
							defaultPosition={task.defaultPos}
							bounds="parent"
							defaultClassName='task-draggable'
							defaultClassNameDragged='task-dragged'
							defaultClassNameDragging='task-dragging'
							onStart={(e) => {
								let style = e.target.style;
								style.zIndex = '100';
							}}
							onStop={(e, data) => {
								updatePos(data, index)
								let style = e.target.style;
								style.boxShadow = '';
								style.zIndex = '5';
							}}
						>
							<div
								className="todo__item"
								style={{
									border: `5px solid ${task.color}`,
									color: task.color
								}}
							>
								{task.text}
								<button
									className='delete'
									onClick={() => deleteNode(task.id)}
									style={{
										color: task.color
									}}
								>
									X
								</button>
							</div>
						</Draggable>
					)
				})
			}
		</div >
	);
};

export default App;