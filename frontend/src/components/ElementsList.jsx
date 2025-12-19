import api from '../api';

export default function ElementsList({ canvasId, elements, setElements }) {

  const deleteElement = async (elementId) => {
    try {
        await api.delete(`/${canvasId}/element/${elementId}`);

        setElements(prev => {
            const elementToDelete = prev.find(el => el.elementId === elementId);

            if(elementToDelete?.previewUrl){
                URL.revokeObjectURL(elementToDelete.previewUrl);
            }
            
            return prev.filter(el => el.elementId !== elementId);
        });

    } catch (err) {
        console.error('Delete failed', err);
    }
  };

  if (elements.length === 0) {
    return (
        <div className='section'>
            <h3>Elements</h3>
            <p>No elements added yet.</p>
        </div>
    );
  }

  return (
    <div className="section">
      <h3>Elements</h3>

      {elements.map((el) => {
        if(!el.elementId){
            console.warn('Missing elementId:', el);
            return null;
        }

        return (
            <div
                key={el.elementId}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                }}
            >
                <span>{el.type}</span>
                <button onClick={() => deleteElement(el.elementId)}>
                    Delete
                </button>
            </div>
        );
      })}
    </div>
  );
}
