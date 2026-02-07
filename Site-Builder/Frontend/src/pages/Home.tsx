import React, { useState, FormEvent } from 'react'
import { Loader2 } from 'lucide-react'

function Home() {

    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }

    return (
        <section className="flex flex-col items-center px-4 pb-20 text-sm text-white font-poppins">
            <a href="https://prebuiltui.com" className="flex items-center gap-2 p-1 pr-3 mt-20 text-sm border rounded-full border-slate-700">
                <span className="px-3 py-1 text-xs bg-indigo-600 rounded-full">NEW</span>
                <p className="flex items-center gap-2">
                    <span>Try 30 days free trial option</span>
                    <svg className="mt-px" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </p>
            </a>
            
            <h1 className="text-center text-[40px] leading-12 md:text-6xl md:leading-17.5 mt-4 font-semibold max-w-3xl">
                Turn thoughts into websites instantly, with AI.
            </h1>

            <p className="max-w-md mt-2 text-base text-center">
                Create, customize and present website faster than ever with AI Site Builder.
            </p>

            <form onSubmit={onSubmitHandler} className="w-full max-w-2xl p-4 mt-10 transition-all border bg-white/10 rounded-xl border-indigo-600/70 focus-within:ring-2 ring-indigo-500">
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    className="w-full text-gray-300 bg-transparent outline-none resize-none"
                    rows={4}
                    placeholder="Describe your website in detail"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                    className="ml-auto flex items-center gap-2 bg-linear-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2 disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 className="text-white animate-spin size-4" />
                            Creating…
                        </>
                    ) : (
                        <>Create with AI</>
                    )}
                </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-16 mx-auto mt-16 md:gap-20">
                <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
                <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
                <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
                <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
                <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
            </div>
        </section>
    )
}

export default Home