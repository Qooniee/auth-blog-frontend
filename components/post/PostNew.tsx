"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { createPost } from "@/actions/post"
import { UserType } from "@/lib/nextauth"
import toast from "react-hot-toast"
import ImageUploading, { ImageListType } from "react-images-uploading"
import Image from "next/image"
import { fetchBookInfo } from "@/lib/fetchBookInfo"

// 入力データの検証ルールを定義
const schema = z.object({
  title: z.string().min(3, { message: "3文字以上入力する必要があります" }),
  content: z.string().min(3, { message: "3文字以上入力する必要があります" }),
  author: z.string().min(1, "著者名を入力してください"),
  isbn: z.string()
    .refine(val => val.length === 10 || val.length === 13, {
      message: "ISBNは10桁または13桁である必要があります"
    })

})

// 入力データの型を定義
type InputType = z.infer<typeof schema>

interface PostNewProps {
  user: UserType
}

// 新規投稿
const PostNew = ({ user }: PostNewProps) => {
  const router = useRouter()
  const [imageUpload, setImageUpload] = useState<ImageListType>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookData, setBookData] = useState<{ title: string, author: string, image: string } | null>(null)
  
  // フォームの状態
  const form = useForm<InputType>({
    // 入力値の検証
    resolver: zodResolver(schema),
    // 初期値
    defaultValues: {
      title: "",
      content: "",
      author: "",
      isbn: "",
    },
  })

  // 送信
  const onSubmit: SubmitHandler<InputType> = async (data) => {
    setIsLoading(true)
    let base64Image

    if (imageUpload.length) {
      base64Image = imageUpload[0].dataURL
    }

    try {
      // 新規投稿
      const res = await createPost({
        accessToken: user.accessToken,
        isbn: data.isbn,
        title: data.title,
        author: data.author,
        content: data.content,
        image: base64Image,
      })

      if (!res.success || !res.post) {
        toast.error("投稿に失敗しました")
        return
      }

      toast.success("投稿しました")
      router.push(`/post/${res.post.uid}`)
      router.refresh()
    } catch (error) {
      toast.error("投稿に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  // ISBNで書籍情報を取得する
  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      return error.message
    }
    return "不明なエラーが発生しました"
  }
  
  const onFetchBookData = async (isbn: string) => {
    // ISBNが10桁または13桁であるかチェック
    if (isbn.length !== 10 && isbn.length !== 13) {
      toast.error("ISBNは10桁または13桁である必要があります")
      return
    }
    try {
      const data = await fetchBookInfo(isbn)
      setBookData(data)
      form.setValue("title", data.title)
      form.setValue("author", data.author)
    } catch (error) {
      toast.error(handleError(error))
    }
  }
  
  // 画像アップロード
  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file
    const maxFileSize = 2 * 1024 * 1024

    // ファイルサイズチェック
    if (file && file.size > maxFileSize) {
      toast.error("ファイルサイズは2MBを超えることはできません")
      return
    }

    setImageUpload(imageList)
  }

  return (
    <div>
      <div className="text-2xl font-bold text-center mb-5">新規投稿</div>
      <Form {...form}>
        <div className="mb-3">
          <FormLabel>サムネイル</FormLabel>
          <div className="mt-2">
            <ImageUploading
              value={imageUpload}
              onChange={onChangeImage}
              maxNumber={1}
              acceptType={["jpg", "png", "jpeg"]}
            >
              {({ imageList, onImageUpload, onImageUpdate, dragProps }) => (
                <div className="w-full">
                  {imageList.length == 0 && (
                    <button
                      onClick={onImageUpload}
                      className="w-full border-2 border-dashed rounded-md h-32 hover:bg-gray-50 mb-3"
                      {...dragProps}
                    >
                      <div className="text-gray-400 font-bold mb-2">
                        ファイル選択またはドラッグ＆ドロップ
                      </div>
                      <div className="text-gray-400 text-xs">
                        ファイル形式：jpg / jpeg / png
                      </div>
                      <div className="text-gray-400 text-xs">
                        ファイルサイズ：2MBまで
                      </div>
                    </button>
                  )}

                  {imageList.map((image, index) => (
                    <div key={index}>
                      {image.dataURL && (
                        <div className="aspect-[16/9] relative">
                          <Image
                            fill
                            src={image.dataURL}
                            alt="thumbnail"
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {imageList.length > 0 && (
                    <div className="text-center mt-3">
                      <Button
                        variant="outline"
                        onClick={() => onImageUpdate(0)}
                      >
                        画像を変更
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </ImageUploading>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ISBNを入力"
                    {...field}
                    onBlur={() => field.value && onFetchBookData(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input placeholder="本のタイトル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>著者</FormLabel>
                <FormControl>
                  <Input placeholder="本の著者" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                    <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>感想</FormLabel>
                <FormControl>
                  <Textarea placeholder="本の感想" {...field} rows={15} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            投稿
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default PostNew
