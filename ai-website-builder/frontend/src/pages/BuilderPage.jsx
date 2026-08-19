import { FolderTreeIcon, MessagesSquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import AgentProgressDashboard from "../components/AgentProgressDashboard";
import BuildHeader from "../components/BuildHeader";
import ChatPanel from "../components/ChatPanel";
import FileExplorer from "../components/FileExplorer";
import Loading from "../components/Loading";
import PreviewPanel from "../components/PreviewPanel";
import PublishModal from "../components/PublishModal";
import { useAppContext } from "../context/AppContext";
import { exportProjectZip } from "../utils/exportProject";

function BuilderPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [leftTab, setLeftTab] = useState("chat");
    const [publishing, setPublishing] = useState(false);
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

    const handleOpenPreview = () => {
        if (!id) return;
        window.open(`/preview/${id}`, "_blank");
    };

    const handlePublish = async () => {
        if (!id) return;

        setPublishing(true);
        try {
            await api.post(`/projects/${id}/publish`);
            const url = `${window.location.origin}/publish/${id}`;
            setPublishUrl(url);
            toast.success("Project published successfully!");
        } catch (error) {
            setPublishing(false);
            toast.error(error?.response?.data?.error || "Failed to publish project. Please try again.");
        } finally {
            setPublishing(false);
        }
    };

    const handleDownload = () => {
        if (!activeProject) return;
        exportProjectZip(activeProject)
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
                publishing={publishing}
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
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer transition-colors${leftTab === "chat" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
                        >
                            <MessagesSquareIcon size={13} />
                            <span>Chat</span>
                        </button>

                        {/* Files Tab */}
                        <button
                            onClick={() => setLeftTab("files")}
                            className={` flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer transition-colors ${leftTab === "files" ? "text-zinc-900 border-b-2 border-zinc-900" : "text-zinc-400 hover:text-zinc-700"}`}
                        >
                            <FolderTreeIcon size={13} />
                            <span>Files</span>
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 min-h-0 overflow-hidden">
                        {leftTab === "chat" ? (
                            <ChatPanel
                                messages={activeProject.messages}
                                onSend={handleChat}
                                loading={chatLoading}
                            />
                        ) : (
                            <FileExplorer
                                files={activeProject.files}
                                activeFile={activeFile}
                                onFileSelect={(path) => {
                                    setActiveFile(path);
                                    setShowCode(true);
                                }}
                            />
                        )}
                    </div>
                </aside>

                {/* Right Code / Preview Area */}
                <div className="flex-1 overflow-hidden">
                    {activeProject.status === 'pending' || activeProject.status === 'generating' || activeProject.status === 'failed' ? (
                        <AgentProgressDashboard project={activeProject} />
                    ) : (
                        <PreviewPanel project={activeProject} activeFile={activeFile} showCode={showCode} />
                    )}
                </div>
            </div>
            {publishUrl && <PublishModal publishUrl={publishUrl} onClose={() => setPublishUrl(null)} />}
        </div>
    );
}

export default BuilderPage;