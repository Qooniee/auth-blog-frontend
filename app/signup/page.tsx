import { redirect } from "next/navigation"
import { getAuthSession } from "@/lib/nextauth"
import Signup from "@/components/auth/Signup"

/**
 * SignupPageにアクセスし、getAuthSession関数を用いて認証チェック
 * 認証されていないユーザーはSignupフォームにredirect
 * 認証されいてるユーザーはホームページにredirect 
 * 
 */

// アカウント仮登録ページ
const SignupPage = async () => {
  // 認証情報取得 非同期処理
  const user = await getAuthSession()

  if (user) {
    redirect("/")
  }

  return <Signup />
}

export default SignupPage