import { useEffect, useState } from 'react';

import { Canvas2D, Rect } from 'canvas2d-wrapper';

import { black, white } from '../../functions/colors.js';
import jsRandomColor from '../../functions/jsRandomColor.js';
import perlin from '../../functions/perlin.js';

import './index.css';

const WIDTH = 1200;
const HEIGHT = 700;
const PIXEL_SIZE = 50;

export default function App() {
	const functions = [
		black,
		white,
		jsRandomColor,
		perlin
	];
	const [selectedFunction, setSelectedFunction] = useState(0);
	const [lastUpdate, setLastUpdate] = useState(0);
	const [elements, setElements] = useState([]);
	const [pixelSize, setPixelSize] = useState(PIXEL_SIZE);

	useEffect(() => {
		const localElements = [];
		for(let x = 0; x < WIDTH; x++) {
			for(let y = 0; y < HEIGHT; y++) {
				localElements.push(new Rect({
					id: x * WIDTH + y,
					x: x - (WIDTH/2),
					y: y - (HEIGHT/2),
					width: 1,
					height: 1,
					fill: 'hsl('+ functions[selectedFunction](x, y, pixelSize) * 250 +',50%,50%)',
				}));
			}
		}

		setElements(localElements);
	}, [selectedFunction, pixelSize, lastUpdate]);

	return (
		<>
			<Canvas2D
				className="canvas"
				elements={elements}
				width={WIDTH}
				height={HEIGHT}
				minZoom={1}
				maxZoom={1}
				tileSize={1}
				dragObjects={false}
				lockXAxis={true}
				lockYAxis={true}
			/>

			<br/>

			<select onChange={(e) => setSelectedFunction(e.target.value)}>
				{functions.map((x, i) => <option key={i} value={i}>{x.name}</option>)}
			</select>

			<input type="button" value="Refresh" onClick={() => setLastUpdate(Date.now())} />

			<br/>

			<input type="button" value="-" onClick={() => setPixelSize(Math.max(pixelSize - 1, 1))} />
			<input type="number" disabled value={pixelSize} />
			<input type="button" value="+" onClick={() => setPixelSize(Math.min(pixelSize + 1, 100))} />
		</>
	);
}
