import { useState } from 'react';
import useSWR from 'swr';
import { Navigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Editor from './Editor';
import Header from '../Header';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    const createNewPost = async (e) => {
        e.preventDefault();

        let data = {
            title,
            summary,
            content,
            author,
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/blog-post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            setRedirect(true);
        }
    };

    const { error } = useSWR('/api/posts', createNewPost);

    if (redirect) {
        return <Navigate to={'/blog'} />;
    }

    return (
        <>
            <Header />
            <div className="container">
                <form style={{ width: '100%' }} onSubmit={createNewPost}>
                    <input
                        type="title"
                        className='form-control'
                        placeholder={'Title'}
                        value={title}
                        onChange={(ev) => setTitle(ev.target.value)}
                    />
                    <br />
                    <input
                        type="summary"
                        className='form-control'
                        placeholder={'Summary'}
                        value={summary}
                        onChange={(ev) => setSummary(ev.target.value)}
                    />
                    <br />
                    <input
                        type="author"
                        className='form-control'
                        placeholder={'Author'}
                        value={author}
                        onChange={(ev) => setAuthor(ev.target.value)}
                    />
                    <br />
                    <Editor value={content} onChange={setContent} />
                    <button style={{ marginTop: '5px' }}>Create post</button>
                    {error && <div>Error: {error.message}</div>}
                </form>
            </div>
        </>

    );
}
