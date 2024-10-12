import React from 'react';
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function Post({ _id, title, summary, cover, content, createdAt, author }) {
  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}` + cover} alt="Post Image"/>
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          {author ? (
            <a className="author">{author.username}</a>
          ) : (
            <span className="author">Unknown Author</span>
          )}
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}

export default Post;
