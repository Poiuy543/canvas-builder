Canvas Builder with PDF Export
A full-stack Canvas Builder application that allows users to create a virtual canvas, add shapes, text, and images (via URL or local upload), manipulate elements, and export the final design as a downloadable PDF.

This project demonstrates frontend–backend integration, canvas rendering, file handling, and production deployment on Render.

# -------------------------------------------------------------

Live Demo:-
Frontend: https://canvas-builder-frontend-p4y0.onrender.com/
Backend Api: https://canvas-builder-backend-onvw.onrender.com/

# -------------------------------------------------------------

Features:-
Canvas:
-Initialize canvas with custom width and height
-Real-time preview using HTML5 Canvas

Shapes: 
-Add rectangles and circles
-Choose fill or stroke
-Custom colors and positioning

Text:
Add text to canvas
Configure:
-Font size
-Font family
-Color
-Alignment

Images: 
-Add image using direct image URL
-Upload image from local system
-Drag images on canvas

Element Management:
-View list of added elements
-Delete individual elements
-Canvas automatically redraws remaining elements

Export:
-Export the final canvas as a compressed PDF

# -------------------------------------------------------------

Tech Stack:-

Frontend:
-React.js
-Axios
-HTML5 Canvas
-CSS

Backend:
Node.js
Express.js
canvas (server-side drawing)
pdfkit (PDF generation)
multer (image upload handling)
cors

Deployment
Render
Backend: Web Service
Frontend: Static Site

# -------------------------------------------------------------

PRoject Structure:-

canvas-builder/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── routes/
│   │   └── canvas.routes.js
│   └── services/
│       └── canvas.service.js
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.jsx
│
├── .gitignore
└── README.md
# -------------------------------------------------------------

API Endpoints:-

Initialize Canvas:
POST /api/canvas/init

Add Rectangle:
POST /api/canvas/:id/add/rectangle

Add Circle:
POST /api/canvas/:id/add/circle

Add Text:
POST /api/canvas/:id/add/text

Add Image via URL:
POST /api/canvas/:id/add/image

Upload Image:
POST /api/canvas/:id/add/image/upload

Delete Element:
DELETE /api/canvas/:id/element/:elementId

Export as PDF:
GET /api/canvas/:id/export/pdf

# -------------------------------------------------------------

Local Setup Instructions:-

Clone Repository:
git clone https://github.com/Poiuy543/canvas-builder.git
cd canvas-builder

Backend setup:
cd backend
npm install
node index.js

Frontend Setup:
cd frontend
npm install
npm start

# -------------------------------------------------------------

Deployment:-

Backend:
Type: Web Service
Root Directory: backend
Build Command: npm install
Start Command: node index.js
Node Version: 18+

Frontend:
Type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build

# -------------------------------------------------------------

CORS Configuration:-

The backend is configured to allow:
Render frontend domains (*.onrender.com)
Localhost for development
This ensures secure cross-origin communication in production.

# -------------------------------------------------------------

Notes & Assumptions:-

Canvas state is stored in-memory (not persistent)
Canvas data is deleted after PDF export
Direct image URLs must end with valid extensions (.jpg, .png, etc.)
Optimized for assignment/demo purposes (not multi-user persistence)

# -------------------------------------------------------------

Key Learnings:-

Handling native Node modules (canvas) in production
Managing CORS for multi-domain deployments
Debugging Express routing edge cases
Full-stack deployment using Render
State-driven canvas renderin