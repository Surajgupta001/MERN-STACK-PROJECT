import { FileCodeIcon, FileTextIcon, FolderOpenIcon } from "lucide-react";
import React, { useMemo } from "react";

function buildTree(paths) {
    const root = [];

    for (const filePath of paths.sort()) {
        const parts = filePath.split("/").filter(Boolean);
        let currentLevel = root;

        for (let i = 0; i < parts.length; i++) {
            const name = parts[i];
            const isLastPart = i === parts.length - 1;
            const fullPath = `/${parts.slice(0, i + 1).join("/")}`;

            let existingNode = currentLevel.find((node) => node.name === name);

            if (!existingNode) {
                existingNode = {
                    name,
                    path: fullPath,
                    isDir: !isLastPart,
                    children: [],
                };
                currentLevel.push(existingNode);
            }
            currentLevel = existingNode.children;
        }
    }
    return root;
}

function getFileIcon(name) {
    if (name.endsWith(".css")) return <FileTextIcon size={14} className="text-sky-500" />
    if (name.endsWith(".jsx") || name.endsWith(".js")) return <FileCodeIcon size={14} className="text-amber-500" />
    if (name.endsWith(".json")) return <FileTextIcon size={14} className="text-emerald-500"/>
    
    return <FileTextIcon size={14} className="text-zinc-500"/>
}

function TreeItem({ node, activeFile, onFileSelect, depth = 0 }) {
    const isActive = node.path === activeFile;

    if (node.isDir) {
        return (
            <div>
                <div
                    className="flex items-center gap-2 px-2 py-1 text-xs select-none text-zinc-400"
                    style={{
                        paddingLeft: `${depth * 12 + 8}px`,
                    }}
                >
                    <FolderOpenIcon size={14} className="text-zinc-800 opacity-60"/>
                    <span>{node.name}</span>
                </div>
                {node.children.map((child) => (
                    <TreeItem
                        key={child.path}
                        node={child}
                        activeFile={activeFile}
                        onFileSelect={onFileSelect}
                        depth={depth + 1}
                    />
                ))}
            </div>
        );
    }

    return (
        <button
            onClick={() => onFileSelect(node.path)}
            className={`w-full flex items-center gap-2 py-1.5 px-2 text-xs transition-colors rounded-md cursor-pointer
                ${isActive
                    ? "bg-zinc-100 text-zinc-950 font-medium"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                }
            `}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
        </button>
    );
}

function FileExplorer({ files, activeFile, onFileSelect }) {
    const tree = useMemo(() => {
        return buildTree(Object.keys(files));
    }, [files]);

    return (
        <div className="py-2 overflow-y-auto hide-scrollbar">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest">
                Files
            </p>

            {tree.map((node) => (
                <TreeItem
                    key={node.path}
                    node={node}
                    activeFile={activeFile}
                    onFileSelect={onFileSelect}
                />
            ))}
        </div>
    );
}

export default FileExplorer;