import { useState, useEffect } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview
} from "@codesandbox/sandpack-react";
import { amethyst } from "@codesandbox/sandpack-themes";

function Chat() {
  const [showPreview, setShowPreview] = useState(false);
  const [files, setFiles] = useState([]);

  const fetchPrompt = async () => {
    try {
      console.log("prompt sending to backend");
      const response = await fetch('http://localhost:8000/api/prompt', {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setFiles(data);
      console.log("Received Files:", data);
    } catch (error) {
      console.error("Error fetching prompt:", error);
    } 
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <div style={{ width: "50%", background: "#20232a", color: "#61dafb", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px" }}>
        Left Side Content
      </div>

      {/* Right Side Sandpack */}
      <div style={{ width: "50%", position: "relative" }}>
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

        <SandpackProvider
          theme={amethyst}
          template="react"
          customSetup={{
            entry: "/src/index.js"
          }}
          files={
            files.length > 0
              ? files.reduce((acc, file) => {
                  acc[file.filepath] = file.code;
                  return acc;
                }, {})
              : {
                  "/App.js": `export default function Example() { return <div>Hello World!</div>; }`
                }
          }
          options={{
            visibleFiles: files.length > 0 ? files.map(file => file.filepath) : ["/App.js"],
            activeFile: files.length > 0 ? files[0].filepath : "/App.js",
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout style={{ height: "100vh", fontSize: "14px" }}>
            {showPreview ? (
              <SandpackPreview
                showNavigator={true}
                showOpenInCodeSandbox={false}
                style={{ flexGrow: 1, height: "100%" }}
              />
            ) : (
              <>
                <SandpackFileExplorer style={{ height: "100%" }} />
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers={true}
                  showInlineErrors
                  closableTabs
                  style={{ height: "100%" }}
                />
              </>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>

  );
}

export default Chat;
