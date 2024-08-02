"use client"
// クライアントコンポーネント指定　サーバー側ではなくクライアントのブラウザ上で実行
// エラー画面
const Error = () => {
  return (
    <div>
      <div className="text-center text-5xl font-bold mb-3">500</div>
      <div className="text-center text-xl font-bold">Server Error</div>
    </div>
  )
}

export default Error