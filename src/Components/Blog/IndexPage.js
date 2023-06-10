import React from 'react'
import useSWR from 'swr'
import Post from './Post'
import Header from '../Header'
import { useNavigate } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useAuthStatus from '../../CustomHooks/useAuthStatus'

const fetcher = (url) => fetch(url).then((res) => res.json())

function IndexPage() {
    const navigate = useNavigate()
    const { loggedIn, checkingStatus } = useAuthStatus();
    const { data: posts, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post`, fetcher)
    console.log("POSTS", posts)
    const handleClick = () => {
        navigate('/create-post')
    }
    return (
        <div>
            <Header />
            <div className="container-md">
                <h1 className="h1">Blog</h1>
                {loggedIn && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleClick}
                            className="btn btn-primary btn-dark"
                        >
                            Create new post
                        </button>
                    </div>
                )}
                {isLoading ? (
                    // Skeleton loader
                    <div>
                        <Skeleton style={{ margin: '12px' }} count={4} height={150} />
                    </div>
                ) : error ? (
                    <div>Error...</div>
                ) : (
                    posts?.data?.length &&
                    posts?.data.map((post) => <Post key={post.id} {...post} />)
                )}
            </div>
        </div>
    )
}

export default IndexPage