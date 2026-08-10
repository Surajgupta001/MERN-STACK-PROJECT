import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {

    const navigate = useNavigate();

    // Auth States
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // States
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeProject, setActiveProject] = useState(null);
    const [loadingActiveProject, setLoadingActiveProject] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [generatingProject, setGeneratingProject] = useState(false);
    const [activeFile, setActiveFile] = useState('/App.js');
    const [showCode, setShowCode] = useState(false);

    // Auth Actions
    const checkSession = async () => {
        try {
            const { data } = await api.get("/api/auth/me");
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = async (emailAddress, password) => {
        try {
            const { data } = await api.post("/api/auth/login", { emailAddress, password });
            setUser(data.user);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error) {
            console.error('Login error:', error);
            const errMsg = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    };

    const register = async (name, emailAddress, password) => {
        try {
            const { data } = await api.post("/api/auth/register", { name, emailAddress, password });
            setUser(data.user);
            toast.success("Account created successfully!");
            navigate("/");
        } catch (error) {
            console.error('Registration error:', error);
            const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
            setUser(null);
            setProjects([]);
            setActiveProject(null);
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch (error) {
            console.error('Logout error:', error);
            const errMsg = error.response?.data?.message || "Logout failed. Please try again.";
            toast.error(errMsg);
            throw new Error(errMsg);
        }
    };

    // Projects Actions
    const loadProjects = async () => {
        if (!user) return;
        try {
            const { data } = await api.get("/api/projects");
            setProjects(data);
        } catch (error) {
            console.error('Projects error:', error);
            toast.error("Failed to load projects. Please try again.");
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadProject = async (id, silent = false) => {
        if (!user) return;
        if (!silent) setLoadingActiveProject(true);
        try {
            const { data } = await api.get(`/api/projects/${id}`);
            setActiveProject(data);

            // Default file Selection
            const files = Object.keys(data.files);
            if (files.length > 0) {
                setActiveFile((prev) => {
                    if (files.includes(prev)) return prev;
                    if (files.includes('/App.js')) return '/App.js';
                    return files[0];
                })
            };
        } catch (error) {
            console.error('Project error:', error);
            if (!silent) {
                toast.error("Failed to load project. Please try again.");
                navigate("/");
            }
        } finally {
            if (!silent) {
                setLoadingActiveProject(false);
            }
        }
    };

    // Automatically poll active project status if generating or pending
    useEffect(() => {
        if (!activeProject?._id || !user) return;

        const isOngoing = activeProject.status === 'generating' || activeProject.status === 'pending' || activeProject.status === 'revising';

        if (!isOngoing) {
            setChatLoading(false);
            const interval = setInterval(() => {
                loadProject(activeProject._id, true);
            }, 2000);
            return () => clearInterval(interval);
        } else {
            setChatLoading(true);
        }
    }, [activeProject?._id, activeProject?.status, loadProject, user]);

    const handleGenerate = useCallback(
        async (prompt) => {
            if (!user) return;
            setGeneratingProject(true);
            try {
                const { data } = await api.post("/api/projects", { prompt });
                toast.success("AI Agent is planning structure....");
                navigate(`/builder/${data._id}`);
            } catch (error) {
                console.error('Project generation error:', error);
                toast.error(error?.response?.data?.message || "Failed to generate project. Please try again.");
            } finally {
                setGeneratingProject(false);
            }
        }, [navigate, user]
    );

    const handleDelete = useCallback(
        async (id) => {
            if (!user) return;
            try {
                await api.delete(`/api/projects/${id}`);
                setProjects((prev) => prev.filter((project) => project._id !== id));
                toast.success("Project deleted successfully!");
            } catch (error) {
                console.error('Project deletion error:', error);
                toast.error('Failed to delete project. Please try again.');
            }
        }, [user]
    );

    return (
        <AppContext.Provider value={{
            user,
            loadingUser,
            login,
            register,
            logout,
            loadProjects,
            loadProject,
            projects,
            loadingProjects,
            activeProject,
            loadingActiveProject,
            chatLoading,
            activeFile,
            setActiveFile,
            showCode,
            setShowCode,
            handleDelete,
            handleGenerate,
            generatingProject
        }}>
            {children}
        </AppContext.Provider>
    )
};

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
}