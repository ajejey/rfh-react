import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import Header from '../Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faShareAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import '../Blog/ckStyles.css'


const fetcher = (url) => fetch(url).then((res) => res.json())

function PostPage() {
    const { path } = useParams()
    const navigate = useNavigate()
    const { loggedIn, checkingStatus } = useAuthStatus()
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${path}`, fetcher)

    const [isSharing, setIsSharing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleShare = () => {
        if (!isSharing) {
            setIsSharing(true);

            if (navigator.share) {
                navigator.share({
                    title: data?.data?.title,
                    text: 'Check out this blog post',
                    url: `https://www.rupeeforhumanity.org/post/${path}`,
                })
                    .then(() => console.log('Shared successfully'))
                    .catch((error) => console.error('Error sharing:', error))
                    .finally(() => setIsSharing(false));
            } else {
                console.log('Web Share API not supported');
                setIsSharing(false);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/edit/${path}`)
    }

    const handleDelete = async () => {
        if (!isDeleting) {
            if (window.confirm('Are you sure you want to delete this blog post?')) {
                setIsDeleting(true);

                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${path}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Clear the cached data and navigate to the blog index page
                        mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post`);
                        navigate('/blog');
                    } else {
                        console.error('Failed to delete the blog post');
                    }
                } catch (error) {
                    console.error('An error occurred while deleting the blog post:', error);
                }

                setIsDeleting(false);
            }
        }
    };

    useEffect(() => {
        // Dynamically load the Web Share API polyfill for unsupported browsers
        if (!navigator.share && window.sharePolyfill) {
            window.sharePolyfill.init();
        }
    }, []);

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
                {loggedIn && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button title='Edit this article' onClick={handleEdit} className='btn btn-dark'>
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button title='Delete this article' onClick={handleDelete} className='btn btn-danger' disabled={isDeleting}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>

                )}
                {/* <div className="ql-container ql-snow" style={{ position: "relative", border: "none" }}> */}
                    <div className="ck-content" data-gramm="false">
                        <div className="content" dangerouslySetInnerHTML={{ __html: data?.data?.content }} />
                    </div>
                {/* </div> */}

                <button onClick={handleShare} className="btn btn-link">
                    <FontAwesomeIcon icon={faShareAlt} className="share-icon" />
                    {"  "}
                    Share this article
                </button>

                <br />
                <br />
            </div>
        </div>
    )
}

export default PostPage
