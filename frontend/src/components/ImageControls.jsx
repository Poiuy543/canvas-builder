import { useState } from 'react';
import api from '../api';

export default function ImageControls({ canvasId, canvasRef, setElements }) {
    const [url, setUrl] = useState('');
    const [x, setX] = useState(300);
    const [y, setY] = useState(80);
    const [width, setWidth] = useState(120);
    const [height, setHeight] = useState(120);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidImageUrl = (url) => {
        return /\.(jpg|jpeg|png|webp|svg)$/i.test(url);
    }

    const addImage = async () => {
        if (!url) {
            setError('Image URL isw required');
            return;
        }

        if (!isValidImageUrl(url)) {
            setError('Please provide a direct image URL (.jpg, .png, .svg)');
            return;
        }

        setError('');
        setLoading(true);

        const data = { url, x, y, width, height };

        try {
            const res = await api.post(`/${canvasId}/add/image`, data);

            if (!res.data.elementId) {
                throw new Error('No elementId returned');
            }


            setElements(prev => [
                ...prev,
                {
                    elementId: res.data.elementId,
                    type: 'image',
                    ...data
                }
            ]);

            setLoading(false);

        } catch (err) {
            console.error(err);
            setError('Failed to load image from URL');
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        if (!file) return;

        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('x', x);
        formData.append('y', y);
        formData.append('width', width);
        formData.append('height', height);

        try {
            const res = await api.post(
                `/${canvasId}/add/image/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (!res.data.elementId) {
                throw new Error('No elementId returned');
            }

            const previewUrl = URL.createObjectURL(file);

            setElements(prev => [
                ...prev,
                {
                    elementId: res.data.elementId,
                    type: 'image',
                    source: 'upload',
                    previewUrl,
                    x,
                    y,
                    width,
                    height
                }
            ]);

            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Image upload failed');
            setLoading(false);
        }
    };


    return (
        <div className="section">
            <h3>Image</h3>

            <label>
                Image URL:
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder='https://example.com/image.png' />
            </label>

            <label>
                Upload Image:
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadImage(e.target.files[0])}
                />
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
                Image Width:
                <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />
            </label>

            <label>
                Image Height:
                <input type="number" value={height} onChange={e => setHeight(+e.target.value)} />
            </label>

            <button onClick={addImage} disabled={loading}>
                {loading ? 'Loading...' : 'Add Image'}
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
