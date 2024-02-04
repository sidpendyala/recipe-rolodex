import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const BlogSection = ({ id, title, description, category, author, timestamp, imgUrl, user, userId, handleDelete }) => {
  return (
    <div>
        <div className="row pb-4" key={id}>
          <div className="hover-blogs-img">
            <div className="blogs-img">
              <img src={imgUrl} alt={title} />
              <div></div>
            </div>c
          </div>
          <div className="col-md-7">
            <div className="text-start">
              <h6 className="category catg-color">{category}</h6>
              <span className="title py-2">{title}</span>
              <span className="meta-info">
                <p className="author">By {author}</p> &nbsp; - &nbsp;
                {timestamp.toDate().toDateString()}
              </span>
            </div>
            <div className="short-description text-start">
              {excerpt(description, 120)}
            </div>
            <Link to={`/detail/${id}`}>
              <button className="btn btn-read">Read more</button>
            </Link>
            {user && user.uid === userId && (
                <div style={{ float: "right" }}>
                <FontAwesomeIcon
                  icon={faTrash}
                  size="2x"
                  onClick={() => handleDelete(id)}
                />
                &nbsp; &nbsp;
                <Link to={`/update/${id}`}>	
                    <FontAwesomeIcon icon={faPenToSquare} size="2x" />
                </Link>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default BlogSection;
