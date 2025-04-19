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
    <div className="flex h-screen w-screen">
      <div className="w-1/2 bg-gray-900 text-blue-400 flex justify-center items-center text-2xl">
        Left Side Content
      </div>

      <div className="w-1/2 h-full">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="absolute top-2.5 right-2.5 z-50 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
        >
          {showPreview ? "Show Code" : "Show Preview"}
        </button>

        <SandpackProvider className="h-full"
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
          <SandpackLayout className="flex-grow h-full text-sm">
            {showPreview ? (
              <SandpackPreview
                showNavigator={true}
                showOpenInCodeSandbox={false}
                className="flex-grow h-full"
              />
            ) : (
              <>
                <SandpackFileExplorer className="flex-grow h-full" />
                <SandpackCodeEditor
                  showTabs
                  showLineNumbers={true}
                  showInlineErrors
                  closableTabs
                  className="flex-grow h-full"
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
