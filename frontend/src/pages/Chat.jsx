import { useState, useRef, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ScaleLoader } from 'react-spinners';

function Chat() {
  const [leftWidth, setLeftWidth] = useState(300);
  const resizerRef = useRef(null);
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const { projectId } = location.state || {};
  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState([]);

  

  const modifyPrompt = async (input) => {
    console.log("Modifying code with instruction:", input);
    setLoading(false);
    try {
      const response = await axios.post(`http://localhost:8000/api/modify/${projectId}`, {
        existingCode: files, // sending the current files JSON
        instruction: input,
      });
      console.log("Modification result:", response.data);
      setLoading(true);
      setFiles(response.data.data.files); // assuming the server returns updated files
      setMessages(response.data.data.interactions); // assuming the server returns updated interactions
    } catch (error) {
      console.error("Error modifying prompt:", error);
    }
  };

  const fetchProject = async () => {
    console.log("Fetching project...");
    try {
      const response = await axios.get(`http://localhost:8000/api/projects/${projectId}`);
      console.log("Fetching project: ", response.data);
      setLoading(true);
      setFiles(response.data.project.files); // assuming the server returns updated files
      setMessages(response.data.project.interactions); // assuming the server returns updated interactions
    } catch (error) {
      console.error("Error fetching prompt:", error);
    }
  };

  useEffect(() => {
    fetchProject();  
  }, []);

  // Resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && containerRef.current) {
        const newWidth =
          e.clientX - containerRef.current.getBoundingClientRect().left;
        if (newWidth > 200 && newWidth < 600) {
          setLeftWidth(newWidth);
        }
      }
    };
    const stopResize = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  const handleSend = () => {
    if (input.trim()) {
      modifyPrompt(input);
      setMessages([...messages, { sender: "user", text: input }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Working on your request..." },
        ]);
      }, 1000);
      setInput("");
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left Chat Panel */}
      <div
        style={{
          width: leftWidth,
          background: "#1e1e1e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "12px" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                background: msg.role === "assistant" ? "#333" : "#7e22ce",
                color: "white",
                padding: "10px 14px",
                margin: "6px 0",
                borderRadius: "12px",
                alignSelf: msg.sender === "assistant" ? "flex-start" : "flex-end",
                maxWidth: "75%",
              }}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #555",
              background: "#2c2c2c",
              color: "white",
            }}
          />
          <button
            onClick={handleSend}
            style={{
              marginLeft: "8px",
              padding: "10px 14px",
              border: "none",
              borderRadius: "8px",
              background: "#7e22ce",
              color: "white",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={() => setIsResizing(true)}
        style={{
          width: "5px",
          cursor: "col-resize",
          background: "#555",
          zIndex: 10,
        }}
      />

      {/* Right Code Area */}
      <div style={{ flexGrow: 1, position: "relative", overflow: "hidden" }}>
        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 999,
            padding: "8px 16px",
            background: "#8a2be2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {showPreview ? "Show Code" : "Show Preview"}
        </button>

        {(files && files.length > 0 && loading) ? (
          <SandpackProvider
            theme={amethyst}
            template="react"
            customSetup={{
              entry: "/src/index.js",
            }}
            files={files.reduce((acc, file) => {
              acc[file.filepath] = file.code;
              return acc;
            }, {})}
            options={{
              visibleFiles: files.map((file) => file.filepath),
              activeFile: files[0].filepath,
              externalResources: ["https://cdn.tailwindcss.com"],
            }}
          >
            <SandpackLayout style={{ height: "100vh", fontSize: "14px" }}>
              {showPreview ? (
                <SandpackPreview
                  showNavigator
                  showOpenInCodeSandbox={false}
                  style={{ flexGrow: 1, height: "100%" }}
                />
              ) : (
                <>
                  <SandpackFileExplorer style={{ height: "100%" }} />
                  <SandpackCodeEditor
                    showTabs
                    showLineNumbers
                    showInlineErrors
                    closableTabs
                    style={{ height: "100%" }}
                  />
                </>
              )}
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#1e1e1e",
            }}
          >
            <ScaleLoader color="#7e22ce" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
