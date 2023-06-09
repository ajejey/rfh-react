import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import Header from '../Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

const fetcher = (url) => fetch(url).then((res) => res.json())

function PostPage() {
    const { id } = useParams()
    console.log("params", id)
    console.log("${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}", `${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}`)
    const { data, error, isLoading } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}`, fetcher)
    console.log("post", data)

    const [isSharing, setIsSharing] = useState(false);

    const handleShare = () => {
        if (!isSharing) {
            setIsSharing(true);

            if (navigator.share) {
                navigator.share({
                    title: data?.data?.title,
                    text: 'Check out this blog post',
                    url: `${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${id}`,
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

    useEffect(() => {
        // Dynamically load the Web Share API polyfill for unsupported browsers
        if (!navigator.share && window.sharePolyfill) {
            window.sharePolyfill.init();
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="container-md" >
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