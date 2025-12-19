import { useState } from 'react';
import api from '../api';

export default function ShapeControls({ canvasId, canvasRef, elements, setElements }) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(80);
  const [radius, setRadius] = useState(40);
  const [color, setColor] = useState('#0000ff');
  const [isFilled, setIsFilled] = useState(true);

  const addRectangle = async () => {
    const data = { x, y, width, height, color, isFilled };

    const res = await api.post(`/${canvasId}/add/rectangle`, data);

    if (!res.data.elementId) {
        console.error('No elementId returned from backend');
        return;
    }

    setElements(prev => [...prev, {
        elementId: res.data.elementId,
        type: 'rectangle',
        ...data
    }]);

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    isFilled ? ctx.fill() : ctx.stroke();
  };

  const addCircle = async () => {
    const data = { x, y, radius, color, isFilled };

    const res = await api.post(`/${canvasId}/add/circle`, data);

    if (!res.data.elementId) {
        console.error('No elementId returned from backend');
        return;
    }

    setElements(prev => [...prev, {
        elementId: res.data.elementId,
        type: 'circle',
        ...data
    }]);

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    isFilled ? ctx.fill() : ctx.stroke();
  };

  return (
    <div className="section">
      <h3>Shapes</h3>

      <label>
        X Position:
        <input type="number" value={x} onChange={e => setX(+e.target.value)} />
      </label>

      <label>
        Y Position:
        <input type="number" value={y} onChange={e => setY(+e.target.value)} />
      </label>

      <label>
        Rectangle Width:
        <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />
      </label>

      <label>
        Rectangle Height:
        <input type="number" value={height} onChange={e => setHeight(+e.target.value)} />
      </label>

      <label>
        Circle Radius:
        <input type="number" value={radius} onChange={e => setRadius(+e.target.value)} />
      </label>

      <label>
        Shape Color:
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </label>

      <label>
        <input
          type="checkbox"
          checked={isFilled}
          onChange={() => setIsFilled(!isFilled)}
        />
        Filled Shape
      </label>

      <button onClick={addRectangle}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
    </div>
  );
}
