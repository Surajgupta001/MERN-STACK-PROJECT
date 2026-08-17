import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import FullPagePreview from "../components/FullPagePreview";
import Loading from "../components/Loading";

function PublishPage() {
    const { id } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchPublicProject = async () => {
            try {
                const { data } = await api.get(`/api/projects/public/${id}`);
                setProject(data);
            } catch (error) {
                console.error("Public project error:", error);

                setError(error?.response?.data?.error || "This website is not available or is not published yet.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublicProject();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen px-4 text-center bg-zinc-50">
                <div className="flex items-center justify-center w-12 h-12 mb-4 text-red-600 rounded-full bg-red-50">
                    <AlertCircleIcon size={24} />
                </div>

                <h1 className="mb-1.5 text-lg font-semibold text-zinc-900">
                    Website Unavailable
                </h1>

                <p className="max-w-sm mb-6 text-sm leading-relaxed text-zinc-500">
                    {error}
                </p>

                <div className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                    BuilderAI
                </div>
            </div>
        );
    }

    return <FullPagePreview files={project.files} />;
}

export default PublishPage;