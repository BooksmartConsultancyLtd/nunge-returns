"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface BlogPost {
  id: number
  title: string
  date: string
  excerpt: string
  content: string
  image: string
}

const originalImages = [
  "https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg",
  "https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg",
  "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg",
  "https://images.pexels.com/photos/6863250/pexels-photo-6863250.jpeg",
  "https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg",
  "https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg",
  "https://images.pexels.com/photos/4475523/pexels-photo-4475523.jpeg",
  "https://images.pexels.com/photos/7681097/pexels-photo-7681097.jpeg",
  "https://images.pexels.com/photos/6863255/pexels-photo-6863255.jpeg",
  "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg"
]

const createBlogPosts = (images: string[]): BlogPost[] => {
  return Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Blog Post ${index + 1}`,
    date: `2023-0${(index % 12) + 1}-15`,
    excerpt: `This is the summary of Blog Post ${index + 1}. Learn key tips, insights, and guidance on tax filing...`,
    content: `This is the full content of Blog Post ${index + 1}. Here, you will find detailed insights, guidance, and tips to help you navigate tax compliance in Kenya.`,
    image: images[index]
  }))
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function initializeBlogPosts() {
      try {
        const response = await fetch('/api/download-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: originalImages.map((url, index) => ({
              url,
              filename: `tax-image-${index + 1}.jpg`
            }))
          })
        })

        if (!response.ok) {
          throw new Error('Failed to download images')
        }

        const { imagePaths } = await response.json()
        setBlogPosts(createBlogPosts(imagePaths))
      } catch (error) {
        console.error('Error initializing blog posts:', error)
        setBlogPosts(createBlogPosts(originalImages))
      } finally {
        setIsLoading(false)
      }
    }

    initializeBlogPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
        <div className="container py-24">
          <div className="mx-auto max-w-7xl space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-indigo-900">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      <div className="container py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900">Nunge Returns Blog</h1>
          <p className="text-xl text-indigo-600">
            Stay updated with the latest news, tips, and insights about tax filing and compliance in Kenya.
          </p>

          {/* Layout changes based on selection */}
          <div className="grid grid-cols-4 gap-6">
            {/* Left column: Blogs */}
            <div
              className={`space-y-4 ${
                selectedPost ? "col-span-1" : "col-span-4 grid grid-cols-5 gap-6"
              } transition-all duration-300`}
            >
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group cursor-pointer rounded-lg border border-emerald-200 bg-white/80 hover:bg-white/90 ${
                    selectedPost ? "flex items-center space-x-4 p-2" : "p-4"
                  } transition-all duration-200 shadow-sm hover:shadow-md`}
                  onClick={() => setSelectedPost(post)}
                >
                  {/* Index for compact view */}
                  {selectedPost && (
                    <span className="text-xs font-bold text-indigo-600">{index + 1}.</span>
                  )}
                  <div className={`${selectedPost ? "w-12 h-12" : "relative h-32"} relative`}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes={selectedPost ? "48px" : "(max-width: 768px) 100vw, 300px"}
                      priority={index < 4 || post.id === selectedPost?.id}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <h2
                      className={`${
                        selectedPost ? "text-sm font-medium" : "text-lg font-semibold"
                      } text-indigo-800 group-hover:text-indigo-900`}
                    >
                      {post.title}
                    </h2>
                    {!selectedPost && (
                      <p className="mt-1 text-xs text-indigo-600">Published on: {post.date}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Right column: Selected Post Preview */}
            {selectedPost && (
              <div className="col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-auto rounded-lg border border-emerald-200 bg-white/80 p-6">
                <h2 className="text-3xl font-bold mb-4 text-indigo-900">{selectedPost.title}</h2>
                <p className="text-sm text-indigo-600 mb-4">Published on: {selectedPost.date}</p>
                <div className="relative h-48 w-full mb-4">
                  <Image
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                    className="object-cover rounded-md"
                    loading="eager"
                  />
                </div>
                <p className="text-lg text-indigo-800">{selectedPost.content}</p>
                <button
                  className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  onClick={() => setSelectedPost(null)}
                >
                  Back to All Blogs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
