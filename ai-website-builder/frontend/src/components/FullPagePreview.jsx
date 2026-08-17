import React, { useMemo, useState } from "react";
import { SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { detectDependencies } from "../utils/sandpackUtils";
import SandPackErrorMonitor from "./SandPackErrorMonitor";

function FullPagePreview({ files }) {
    const [showErrorOverlay, setShowErrorOverlay] = useState(true);

    const sandPackFiles = useMemo(() => {
        if (!files) return {};

        const spFiles = {};

        for (const [path, content] of Object.entries(files)) {
            spFiles[path] = { code: typeof content === "string" ? content : content?.code || content?.content || "", };
        }
        return spFiles;
    }, [files]);

    const dependencies = useMemo(() => {
        if (!files) return {};

        return detectDependencies(files);
    }, [files]);

    return (
        <div className="w-screen h-screen overflow-hidden bg-white">
            <SandpackProvider
                template="react"
                files={sandPackFiles}
                customSetup={{
                    dependencies,
                }}
                options={{
                    externalResources: [
                        "https://cdn.tailwindcss.com",
                        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
                    ],
                    logLevel: 0,
                }}
                className="w-full h-full"
            >
                <SandPackErrorMonitor
                    onErrorChange={setShowErrorOverlay}
                />

                <SandpackLayout
                    className="w-full h-full border-none! bg-transparent"
                >
                    <SandpackPreview
                        showNavigator={false}
                        showRefreshButton={false}
                        showOpenInCodeSandbox={false}
                        showSandpackErrorOverlay={showErrorOverlay}
                        className="w-full h-full"
                    />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
}

export default FullPagePreview;