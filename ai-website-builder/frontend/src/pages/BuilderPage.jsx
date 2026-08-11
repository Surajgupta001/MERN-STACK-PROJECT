import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loading from "../components/Loading";
import BuildHeader from "../components/BuildHeader";
import { FolderTreeIcon, MessagesSquareIcon } from "lucide-react";
import ChatPanel from "../components/ChatPanel";

function BuilderPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lefttab, setLeftTab] = useState("chat");
    const [publish, setPublish] = useState(false);
    const [publishUrl, setPublishUrl] = useState(null);

    const {
        activeProject,
        loadingActiveProject,
        activeFile,
        showCode,
        setActiveFile,
        setShowCode,
        loadProject,
        logout,
        chatLoading,
        handleChat
    } = useAppContext();

    useEffect(() => {
        if (!id) return;

        loadProject(id);
    }, [id]);

    useEffect(() => {
        if (!id || !activeProject) return;

        if (activeProject?.status === "pending" || activeProject?.status === "generating") {
            const interval = setInterval(() => {
                loadProject(id, true);
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [id, loadProject, activeProject]);

    const handleOpenPreview = () => {
        if (!id) return;

        window.open(`/preview/${id}`, "_blank");
    };

    const handlePublish = async () => {
        // Handle publish here
    };

    const handleDownload = () => {
        // Handle download here
    };

    if (loadingActiveProject || !activeProject) {
        return <Loading />;
    }

    return (
        <div className="relative flex flex-col h-screen overflow-hidden bg-white text-zinc-900">

            {/* Header */}
            <BuildHeader
                projectName={activeProject.name}
                version={activeProject.version}
                showCode={showCode}
                publishing={publish}
                onToggleShowCode={() => setShowCode(!showCode)}
                onOpenPreview={handleOpenPreview}
                onPublish={handlePublish}
                onDownload={handleDownload}
                onBack={() => navigate("/")}
                onLogout={logout}
            />

            {/* Main Layout */}
            <div className="flex flex-1 min-h-0 overflow-hidden">

                {/* Left Sidebar */}
                <aside className="flex flex-col w-[320px] shrink-0 border-r border-zinc-200 bg-white">

                    {/* Sidebar Tabs */}
                    <div className="flex border-b shrink-0 border-zinc-100">

                        {/* Chat Tab */}
                        <button
                            onClick={() => setLeftTab("chat")}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer transition-colors${lefttab === "chat" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
                        >
                            <MessagesSquareIcon size={13} />
                            <span>Chat</span>
                        </button>

                        {/* Files Tab */}
                        <button
                            onClick={() => setLeftTab("files")}
                            className={` flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer transition-colors ${lefttab === "files" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
                        >
                            <FolderTreeIcon size={13} />
                            <span>Files</span>
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        {lefttab === "chat" ? (
                            <ChatPanel
                                messages={activeProject.messages}
                                onSend={handleChat}
                                loading={chatLoading}
                            />
                        ) : (
                            <div className="p-4 text-sm text-zinc-400">
                                Files Panel
                            </div>
                        )}
                    </div>
                </aside>

                {/* Right Code / Preview Area */}
                <main className="flex-1 min-w-0 min-h-0 overflow-hidden bg-white">
                    {/* Code / Preview will go here */}
                </main>
            </div>
        </div>
    );
}

export default BuilderPage;