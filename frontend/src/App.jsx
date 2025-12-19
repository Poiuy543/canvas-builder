import { useRef, useState, useEffect } from 'react';
import api from './api';

import CanvasInit from './components/CanvasInit';
import ShapeControls from './components/ShapeControls';
import TextControls from './components/TextControls';
import ImageControls from './components/ImageControls';
import PreviewCanvas from './components/PreviewCanvas';
import ElementsList from './components/ElementsList';

export default function App() {
  const canvasRef = useRef(null);
  const [canvasId, setCanvasId] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (!selectedElementId || !isDragging.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(prev =>
      prev.map(el =>
        el.elementId === selectedElementId
          ? { ...el, x, y }
          : el
      )
    );
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseDown = () => {
  if (selectedElementId) {
    isDragging.current = true;
  }
};


  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(el => {
      ctx.beginPath();

      if (el.type === 'rectangle') {
        ctx.rect(el.x, el.y, el.width, el.height);
        ctx.fillStyle = el.color;
        ctx.strokeStyle = el.color;
        el.isFilled ? ctx.fill() : ctx.stroke();
      }

      if (el.type === 'circle') {
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.strokeStyle = el.color;
        el.isFilled ? ctx.fill() : ctx.stroke();
      }

      if (el.type === 'text') {
        ctx.font = `${el.fontSize}px Arial`;
        ctx.fillStyle = el.color;
        ctx.textAlign = el.align;
        ctx.fillText(el.text, el.x, el.y);
      }

      if (el.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = el.url || el.previewUrl;
        img.onload = () => {
          ctx.drawImage(img, el.x, el.y, el.width, el.height);
        };
      }
    });
  };

  const initCanvas = async () => {
    const res = await api.post('/init', dimensions);
    setCanvasId(res.data.canvasId);
    setElements([]);
  };

  // Set canvas size
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
  }, [dimensions.width, dimensions.height]);

  // ✅ REDRAW ON ELEMENT CHANGE
  useEffect(() => {
    if (canvasId) {
      redrawCanvas();
    }
  }, [elements, canvasId]);

  const exportPDF = () => {
    window.open(`http://localhost:3000/api/canvas/${canvasId}/export/pdf`);
  };

  return (
    <div className="app">
      <h1>Canvas Builder</h1>

      <CanvasInit
        dimensions={dimensions}
        setDimensions={setDimensions}
        initCanvas={initCanvas}
      />

      {canvasId && (
        <>
          <div className="controls">
            <ShapeControls canvasId={canvasId} canvasRef={canvasRef} elements={elements} setElements={setElements} />
            <TextControls canvasId={canvasId} canvasRef={canvasRef} setElements={setElements} />
            <ImageControls canvasId={canvasId} canvasRef={canvasRef} setElements={setElements} />
          </div>

          <ElementsList canvasId={canvasId} elements={elements} setElements={setElements} />

          <PreviewCanvas canvasRef={canvasRef} elements={elements} selectedElementId={selectedElementId} setSelectedElementId={setSelectedElementId} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />

          <button className="export-btn" onClick={exportPDF}>
            Export as PDF
          </button>
        </>
      )}
    </div>
  );
}
