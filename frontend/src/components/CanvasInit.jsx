export default function CanvasInit({ dimensions, setDimensions, initCanvas }) {
  return (
    <div className="section">
      <h2>Initialize Canvas</h2>

      <input
        type="number"
        placeholder="Width"
        value={dimensions.width}
        onChange={e =>
          setDimensions({ ...dimensions, width: Number(e.target.value) })
        }
      />

      <input
        type="number"
        placeholder="Height"
        value={dimensions.height}
        onChange={e =>
          setDimensions({ ...dimensions, height: Number(e.target.value) })
        }
      />

      <button onClick={initCanvas}>Create Canvas</button>
    </div>
  );
}
