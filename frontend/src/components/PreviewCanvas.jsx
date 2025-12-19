export default function PreviewCanvas({ canvasRef, elements, selectedElementId, setSelectedElementId, onMouseDown, onMouseMove, onMouseUp }) {

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (el.type === 'image') {
                if (
                    x >= el.x &&
                    x <= el.x + el.width &&
                    y >= el.y &&
                    y <= el.y + el.height
                ) {
                    setSelectedElementId(el.elementId);
                    onMouseDown();
                    return;
                }
            }
        }
        setSelectedElementId(null);
    };


    return (
        <div className="canvas-wrapper">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                style={{ border: '1px solid black' }}
             />
        </div>
    );
}
