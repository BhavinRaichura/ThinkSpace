# ThinkSpace: A Collaborative Online Whiteboard

ThinkSpace is a powerful, intuitive online whiteboard application built with React that enables users to brainstorm, sketch ideas, draw diagrams, and plan system architecture in real-time.

## 🌟 Features

### Core Drawing Tools
- **Pen** - Freehand drawing with customizable stroke width and color
- **Line** - Draw straight lines between two points
- **Rectangle** - Create rectangular shapes with optional fill patterns
- **Circle** - Draw ellipses and circles with customizable properties
- **Eraser** - Remove drawings by erasing portions of the canvas
- **Select Tool** - Click and highlight specific elements on the canvas

### Customization Options
- **Stroke Color** - Choose from predefined colors or custom color picker
- **Stroke Width** - Adjustable thickness (2, 5, 7 pixels)
- **Background Fill** - Fill shapes with solid, hachure, or zigzag patterns
- **Fill Styles** - Hachure, Solid, Zigzag patterns for shape outlines

### Productivity Features
- **Undo/Redo** - Revert or reapply drawing operations (Ctrl+Z, Ctrl+Y)
- **Clear Canvas** - Remove all drawings at once
- **Keyboard Shortcuts** - Number keys (1-6) to quickly switch between tools
- **Delete Operations** - Select and delete individual elements

### Data Persistence
- **Local Storage** - All drawings automatically saved to browser storage
- **Room-Based Storage** - Each room maintains its own drawing state
- **Session Recovery** - Resume previous work by joining an existing room

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Touch Support** - Full touch event support for mobile drawing
- **Real-time Preview** - See drawing preview while sketching
- **Selection Highlighting** - Visual feedback for selected elements

## 📁 Project Structure

```
ThinkSpace/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── sitemap.xml
│   └── robots.txt
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── RoomPage.jsx
│   ├── components/
│   │   ├── NotFound.jsx
│   │   ├── forms/
│   │   │   ├── CreateRoomForm/
│   │   │   └── JoinRoomForm/
│   │   └── whiteboard/
│   │       ├── index.jsx
│   │       ├── canvas/
│   │       ├── toolbar/
│   │       ├── stylebar/
│   │       └── cursor/
│   ├── utils/
│   │   ├── room/
│   │   │   └── roomIdGenerator.js
│   │   └── settings/
│   │       ├── state.js
│   │       ├── actions.js
│   │       └── all/
│   │           ├── tools.js
│   │           └── config.js
│   └── styles/
├── tailwind.config.js
├── package.json
└── README.md
```

## 🛠️ Technologies Used

- **React 18.2.0** - UI library
- **React Router DOM 6.22.0** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **RoughJS 4.6.6** - Hand-drawn, sketchy graphics
- **React Icons 5.0.1** - SVG icon library
- **UUID 9.0.1** - Unique ID generation
- **Socket.IO Client 4.7.4** - WebSocket support (future collaboration)

## 🚀 Getting Started

### Prerequisites
- Node.js 12.0+
- npm 6.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ThinkSpace.git
cd ThinkSpace

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## 💡 How to Use

### Creating a New Room
1. Enter your name in the "Create a Room" form
2. System auto-generates a unique room ID
3. Click "Create Room" to start drawing

### Joining a Room
1. Select a room from the "Join Room" dropdown
2. Click "Join Room" to access the whiteboard

### Drawing
1. Select a tool from the toolbar
2. Use the style bar to customize properties
3. Draw on the canvas
4. **Keyboard Shortcuts:**
   - **1-6** - Switch tools
   - **Ctrl+Z** - Undo
   - **Ctrl+Y** - Redo
   - **Delete** - Remove selected element

## 🔄 Data Management

### Local Storage
- Rooms index stored with creation timestamps
- Drawing data includes update timestamps
- Automatic cleanup of rooms older than 30 days
- Corrupted data is safely removed

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Known Limitations

1. **Real-time Collaboration** - Socket.IO prepared but not implemented
2. **Text Tool** - In development
3. **Cursor Tracking** - Multi-user cursor display in progress
4. **Currently offline-only** - localStorage-based

## 🔮 Future Enhancements

- [ ] Real-time collaborative drawing with WebSockets
- [ ] User presence indicators with cursor tracking
- [ ] Text tool for annotations
- [ ] Shape resizing and rotation
- [ ] Cloud storage integration
- [ ] Export to image/PDF
- [ ] Zoom and pan controls
- [ ] Drawing templates

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run eject` | Expose configuration |

## 📄 License

Available for personal and commercial use.

## 🤝 Contributing

Contributions welcome! Please fork, create a feature branch, and submit a pull request.

## 📞 Support

For issues or feature requests, please open an issue on GitHub.

---

**ThinkSpace** - *A space to brainstorm freely and unleash your creativity*

Built with ❤️ using React, Tailwind CSS, and RoughJS