import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import useSWR, { mutate } from "swr";
import Editor from "./Editor";
import Header from "../Header";
import Skeleton from "react-loading-skeleton";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function EditPost() {
    const { path } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [redirect, setRedirect] = useState(false);

    const { data: postInfo } = useSWR(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${path}`,
        fetcher
    );

    console.log("postInfo", postInfo);

    if (!postInfo) {
        return (
            <div>
                <Header />
                <div className="container">
                    <Skeleton style={{ margin: '12px' }} count={4} height={50} width={500} />
                </div>
            </div>
        );
    }

    const updatePost = async (ev) => {
        ev.preventDefault();

        const updatedPost = {
            title,
            summary,
            content,
            author,
        };

        await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${path}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedPost),
            // credentials: "include",
        });

        mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post/${path}`);
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to={`/post/${path}`} />;
    }

    return (
        <>
            <Header />
            <div className="container">
                <form onSubmit={updatePost}>
                    <input
                        type="title"
                        className='form-control mb-3'
                        placeholder={"Title"}
                        value={title || postInfo.data.title}
                        onChange={(ev) => setTitle(ev.target.value)}
                    />
                    <input
                        type="summary"
                        className='form-control mb-3'
                        placeholder={"Summary"}
                        value={summary || postInfo.data.summary}
                        onChange={(ev) => setSummary(ev.target.value)}
                    />
                    <input
                        type="author"
                        className='form-control mb-3'
                        placeholder={"Author"}
                        value={author || postInfo.data.author}
                        onChange={(ev) => setAuthor(ev.target.value)}
                    />
                    <Editor onChange={setContent} value={content || postInfo.data.content} />
                    <button style={{ marginTop: "5px" }}>Update post</button>
                </form>
            </div>

        </>
    );
}
