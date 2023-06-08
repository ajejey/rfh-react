import React from 'react'
import Header from '../Header'
import { Link } from 'react-router-dom'

function Post({ _id, title, content, author, date, summary }) {
    return (
        <div
            style={{
                margin: '20px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
            }}
        >
            <Link
                to={`/post/${_id}`}
                style={{
                    textDecoration: 'none',
                    color: '#000',
                }}
            >
                <h2
                    style={{
                        fontSize: '24px',
                        marginBottom: '10px',
                    }}
                >
                    {title}
                </h2>
                <small
                    style={{
                        fontSize: '12px',
                        color: '#777',
                    }}
                >
                    {author}
                </small>
                <br />
                <small
                    style={{
                        fontSize: '12px',
                        color: '#777',
                    }}
                >
                    {new Date(date).toDateString()}
                </small>
                <br />
                <p
                    style={{
                        marginTop: '10px',
                        fontSize: '14px',
                    }}
                >
                    {summary}
                </p>
            </Link>
        </div>
    )
}

export default Post