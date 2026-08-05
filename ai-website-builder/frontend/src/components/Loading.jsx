import { Loader2Icon } from 'lucide-react'

function Loading() {
    return (
        <div role='status' aria-label='loading' className='flex items-center justify-center h-screen bg-white'>
            <Loader2Icon size={26} className='animate-spin text-zinc-950' />
        </div>
    )
}

export default Loading