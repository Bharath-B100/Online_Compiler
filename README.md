# Online Compiler

A modern, interactive online code compiler web application with a clean UI and smooth user experience.

## Features

- 🧠 **Multi-language Support**: JavaScript (Node.js), Python, Java
- 💻 **Interactive Code Editor**: Monaco Editor with VS Code-like experience
- ▶️ **Run Code Button**: Execute code with loading spinner
- 📤 **Backend Execution**: Safe code execution using child_process
- 📺 **Output Console**: Terminal-style output display
- ⚠️ **Error Handling**: Clear error messages and 5-second timeout
- 🎨 **Dark Theme**: VS Code inspired modern UI
- ⌨️ **Keyboard Shortcuts**: Ctrl+Enter to run code

## Tech Stack

### Frontend
- **React.js** (with Vite)
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing

### Backend
- **Node.js** with Express
- **child_process** for code execution
- **Basic security filtering**

## Project Structure

```
Online-compiler/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Editor.jsx
│   │   │   └── Output.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── routes/
│   │   └── execute.js
│   ├── utils/
│   │   └── runCode.js
│   ├── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Python 3 (for Python code execution)
- Java JDK (for Java code execution)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Make sure both frontend and backend servers are running
2. Open your browser and navigate to `http://localhost:5173`
3. Select your preferred programming language from the dropdown
4. Write your code in the Monaco Editor
5. Click "Run Code" or press `Ctrl+Enter` to execute
6. View the output in the console on the right

## Language Support

### JavaScript (Node.js)
- Runs using Node.js interpreter
- Full ES6+ support
- Console output displayed

### Python
- Requires Python 3 installed
- Standard library functions supported
- Print statements and error handling

### Java
- Requires Java JDK installed
- Automatic compilation and execution
- Main class structure required

## Security Features

- **Execution Timeout**: 5-second limit to prevent infinite loops
- **Basic Filtering**: Blocks dangerous system commands
- **Temporary Files**: Code execution in isolated temp files
- **Cleanup**: Automatic removal of temporary files

## API Endpoints

### POST /api/execute
Execute code in the specified language.

**Request Body:**
```json
{
  "language": "javascript|python|java",
  "code": "your code here"
}
```

**Response:**
```json
{
  "success": true,
  "output": "program output",
  "error": "error messages (if any)"
}
```

## Development

### Adding New Languages

1. Update the language list in `frontend/src/components/Navbar.jsx`
2. Add language support in `backend/utils/runCode.js`
3. Update Monaco Editor language mapping in `frontend/src/components/Editor.jsx`

### Customization

- **UI Theme**: Modify Tailwind CSS classes in components
- **Editor Settings**: Update Monaco Editor options in `Editor.jsx`
- **Security Rules**: Adjust filtering patterns in `backend/routes/execute.js`

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure backend server is running on port 5000
2. **Language Not Working**: Check if the required interpreter is installed
3. **Permission Errors**: Ensure temp directory has write permissions
4. **Compilation Errors**: Check code syntax and language requirements

### Port Configuration

To change ports, update:
- Frontend: Vite configuration
- Backend: PORT environment variable or modify `index.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
