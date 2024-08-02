"use client"
import { Button } from "@/components/ui/button"
import { UserType } from "@/lib/nextauth"
import UserNavigation from "@/components/auth/UserNavigation"
import Link from "next/link"

interface NavigationProps {
  user: UserType | null
}

// ナビゲーション
const Navigation = ({ user }: NavigationProps) => {
  return (
    <header className="bg-pink-50 shadow-md shadow-pink-200 mb-10 rounded-lg">
      <div className="container mx-auto flex max-w-screen-md items-center justify-between px-4 py-3">
        <Link href="/" className="cursor-pointer text-2xl font-bold text-pink-600">
          RingsLog
        </Link>
        
        {user ? (
          <div>
            <UserNavigation user={user} />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost" className="font-bold bg-pink-100 text-pink-600 hover:bg-pink-200">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild variant="default" className="font-bold bg-pink-500 text-white hover:bg-pink-600">
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navigation
