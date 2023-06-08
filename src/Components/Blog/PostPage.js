import React from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import Header from '../Header'

const fetcher = (url) => fetch(url).then((res) => res.json())

function PostPage() {
    const { id } = useParams()
    console.log("params", id)
    console.log("${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}", `${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}`)
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}`, fetcher)
    console.log("post", data)
    return (
        <div>
            <Header />
            <div className="container-md">
                {isLoading && <div>Loading...</div>}
                {error && <div>Error...</div>}
                <h1 className='h1'>{data?.data?.title}</h1>
                <small>{data?.data?.author}</small>
                <br />
                <small>{new Date(data?.data?.date).toDateString()}</small>
                <br />
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: data?.data?.content }}
                />

            </div>
        </div>
    )
}

export default PostPage