import { useParams } from "react-router-dom"
import { AuthView } from "@daveyplate/better-auth-ui"

export default function AuthPage() {
    const { pathname } = useParams()

    return (
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6">
            <AuthView pathname={pathname} classNames={{ base: 'bg-black/10 ring ring-indigo-900 shadow-2xl shadow-indigo-500/20' }}/>
        </main>
    )
}