import React, { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, CloudUploadIcon, Loader2Icon, MicIcon } from 'lucide-react'

function PromptInput({ onSubmit, loading = false, placeholder = "Describe your website needs...", large = false, autoFocus = false, variant = "default" }) {

    const [value, setvalue] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || loading) return;
        onSubmit(trimmed);
        setvalue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (variant === "glass") {
        return (
            <form onSubmit={handleSubmit} className='w-full max-w-2xl mx-auto mt-6 overflow-hidden transition bg-white/10 backdrop-blur-xl rounded-xl ring-1 ring-white/25 focus-within:ring-2 focus-within:ring-white/30'>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setvalue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={loading}
                    rows={3}
                    className='w-full p-4 pb-2 text-base text-white bg-transparent outline-none resize-none placeholder:text-white/60'
                />
                <div className='flex items-center justify-between gap-2 px-3 pb-3'>
                    <label htmlFor="file" className='border border-white/20 text-white/80 hover:text-white hover:border-white/30 p-1.5 rounded-md cursor-pointer flex items-center justify-center'>
                        <input type="file" id="file" hidden />
                        <CloudUploadIcon size={18} />
                    </label>
                    <div className='flex items-center justify-end gap-2'>
                        <button type='button' className='flex items-center justify-center p-1 cursor-pointer text-white/70 hover:text-white'>
                            <MicIcon size={18} />
                        </button>
                        <button
                            type='submit'
                            disabled={!value.trim() || loading}
                            className='flex items-center justify-center p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 cursor-pointer '
                        >
                            {loading ? <Loader2Icon className='animate-spin' size={18} /> : <ArrowRightIcon size={18} />}
                        </button>
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div className={`bg-white border border-zinc-200 rounded-xl flex items-end gap-2 focus:within:ring-1 focus-within:ring-zinc-300 transition ${large ? "p-4" : "p-2.5"} ${loading ? "opacity-50" : ""}`}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setvalue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                rows={large ? 5 : 1}
                className={`flex-1 bg-transparent border-none outline-none resize-none text-zinc-900 placeholder:text-zinc-400 ${large ? "text-base" : "text-sm"}`}
            />
            <button
                onClick={() => handleSubmit()}
                disabled={!value.trim() || loading}
                className='inline-flex items-center justify-center text-white rounded-full cursor-pointer bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 shrink-0'
                style={{
                    width: large ? 36 : 24,
                    height: large ? 36 : 24
                }}
            >
                {loading ? <Loader2Icon className='animate-spin' size={large ? 20 : 15} /> : <ArrowRightIcon size={large ? 20 : 15} />}
            </button>
        </div>
    )
}

export default PromptInput