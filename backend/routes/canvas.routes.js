const express = require('express');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');
const { loadImage } = require('canvas');

const {
    createNewCanvas,
    getCanvas,
    deleteCanvas
} = require('../services/canvas.service');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/init', (req, res) => {
    const { width, height } = req.body;

    if(!width || !height || width <= 0 || height <= 0){
        return res.status(400).json({ error: 'Invalid canvas size' });
    }

    const id = crypto.randomUUID();
    createNewCanvas(id, width, height);

    res.json({ canvasId: id });
});

router.post('/:id/add/rectangle', (req, res) => {
  const { id } = req.params;
  const { x, y, width, height, color = '#000000', isFilled = true } = req.body;

  if(!x && x !== 0 || !y && y !== 0 || !width || !height) {
    return res.status(400).json({ error: 'Invalid rectangle parameters' });
  }

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  const elementId = crypto.randomUUID();
  const ctx = data.canvas.getContext('2d');

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (isFilled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }

  
  data.elements.push({
    elementId,
    type: 'rectangle',
    x, 
    y,
    width,
    color,
    isFilled
  });

  res.json({
    message: 'Rectangle added',
    elementId
  });
});

router.post('/:id/add/circle', (req, res) => {
  const { id } = req.params;
  const { x, y, radius, color = '#000000', isFilled = true } = req.body;

  if (!x && x !== 0 || !y && y !== 0 || !radius) {
    return res.status(400).json({ error: 'Invalid circle parameters' });
  }

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  const elementId = crypto.randomUUID();
  const ctx = data.canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  if (isFilled) {
    ctx.fill();
  } else {
    ctx.stroke();
  }

  // ✅ store element state
  data.elements.push({
    elementId,
    type: 'circle',
    x,
    y,
    radius,
    color,
    isFilled
  });

  res.json({
    message: 'Circle added',
    elementId
  });
});

router.post('/:id/add/text', (req, res) => {
  const { id } = req.params;
  const { text, x, y, fontSize = 16, fontFamily = 'Arial', color = '#000', align = 'left' } = req.body;

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  const elementId = crypto.randomUUID();

  const ctx = data.canvas.getContext('2d');
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(text, x, y);

  data.elements.push({
    elementId,
    type: 'text',
    text,
    x,
    y,
    fontSize,
    fontFamily,
    color,
    align
  });

  res.json({
    message: 'Text added',
    elementId
  });
});

router.post('/:id/add/image', async (req, res) => {
  const { id } = req.params;
  const { url, x, y, width, height } = req.body;

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  const elementId = crypto.randomUUID();

  try {
    console.log('Fetching image:', url);

    const response = await fetch(url);
    if(!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const img = await loadImage(buffer);
    const ctx = data.canvas.getContext('2d');
    ctx.drawImage(img, x, y, width || img.width, height || img.height);

    data.elements.push({
      elementId,
      type: 'image',
      url,
      x,
      y,
      width: width || img.width,
      height: height || img.height
    });

    res.json({
      message: 'Image added',
      elementId
    });
  } catch(err) {
    console.error('image load failed:', err.message);
    res.status(500).json({
      error: 'image load failed',
      details: err.message
    });
  }
});

router.post('/:id/add/image/upload', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { x, y, width, height } = req.body;

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const elementId = crypto.randomUUID();

  try {
    const img = await loadImage(req.file.buffer);
    const ctx = data.canvas.getContext('2d');

    const w = width || img.width;
    const h = height || img.height;

    ctx.drawImage(img, x, y, w, h);

    data.elements.push({
      elementId,
      type: 'image',
      source: 'upload',
      x,
      y,
      width: w,
      height: h
    });

    res.json({
      message: 'Image uploaded',
      elementId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process image' });
  }
});


router.get('/:id/export/pdf', (req, res) => {
  const { id } = req.params;
  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  const canvas = data.canvas;
  const buffer = canvas.toBuffer('image/png');

  const pdf = new PDFDocument({
    size: [canvas.width, canvas.height],
    compress: true
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=canvas.pdf');

  pdf.pipe(res);
  pdf.image(buffer, 0, 0);
  pdf.end();

  deleteCanvas(id);
});

// Delete route
router.delete('/:id/element/:elementId', async (req, res) => {
  const { id, elementId } = req.params;

  const data = getCanvas(id);
  if (!data) return res.status(404).json({ error: 'Canvas not found' });

  // Remove element
  data.elements = data.elements.filter(el => el.elementId !== elementId);

  // Clear canvas
  const ctx = data.canvas.getContext('2d');
  ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);

  // Re-draw remaining elements
  for (const el of data.elements) {
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

    if (el.type === 'image') {
      const img = await loadImage(el.url);
      ctx.drawImage(img, el.x, el.y, el.width, el.height);
    }
  }

  res.json({ message: 'Element deleted successfully' });
});




module.exports = router;
