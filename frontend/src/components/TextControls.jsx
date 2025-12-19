import { useState } from 'react';
import api from '../api';

export default function TextControls({ canvasId, canvasRef, setElements }) {
  const [text, setText] = useState('Hello Canvas');
  const [x, setX] = useState(100);
  const [y, setY] = useState(250);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ff0000');
  const [align, setAlign] = useState('left');

  const addText = async () => {
    const data = { text, x, y, fontSize, color, align };

    const res = await api.post(`/${canvasId}/add/text`, data);

    if(!res.data.elementId) {
        console.log('No elementId returned from backend');
        return;
    }

    setElements(prev => [
        ...prev,
        {
            elementId: res.data.elementId,
            type: 'text',
            ...data
        }
    ]);

    const ctx = canvasRef.current.getContext('2d');
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  };

  return (
    <div className="section">
       <label>
        Text Content:
        <input value={text} onChange={e => setText(e.target.value)} />
      </label>

      <label>
        X Position:
        <input type="number" value={x} onChange={e => setX(+e.target.value)} />
      </label>

      <label>
        Y Position:
        <input type="number" value={y} onChange={e => setY(+e.target.value)} />
      </label>

      <label>
        Font Size:
        <input type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
      </label>

      <label>
        Text Color:
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </label>

      <label>
        Text Alignment:
        <select value={align} onChange={e => setAlign(e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>

      <button onClick={addText}>Add Text</button>
    </div>
  );
}
