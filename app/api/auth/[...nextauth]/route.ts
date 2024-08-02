/**
 * NextAuth APIルート
 * Next.js で認証機能を実装するためのライブラリ
 * Google / Facebook等の認証プロバイダと連携できる
 */
import { authOptions } from "@/lib/nextauth"
import NextAuth from "next-auth/next"

// NextAuth関数に設定オプションを渡して認証ハンドラを作成
const handler = NextAuth(authOptions)// lib/nextauth.tsに設定あり

// 作成したハンドラをGETとPOSTのリクエストハンドラとしてエクスポート
export { handler as GET, handler as POST }