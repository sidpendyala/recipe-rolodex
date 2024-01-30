import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const BlogSection = ({ blogs, user, handleDelete }) => {
  const userId = user?.uid;
  return (
    <div>
      <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
      {blogs?.map((item) => (
        <div className="row pb-4" key={item.id}>
          <div className="hover-blogs-img">
            <div className="blogs-img">
              <img src={item.imgUrl} alt={item.title} />
              <div></div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="text-start">
              <h6 className="category catg-color">{item.category}</h6>
              <span className="title py-2">{item.title}</span>
              <span className="meta-info">
                <p className="author">By {item.author}</p> &nbsp; - &nbsp;
                {item.timestamp.toDate().toDateString()}
              </span>
            </div>
            <div className="short-description text-start">
              {excerpt(item.description, 120)}
            </div>
            <Link to={`/detail/${item.id}`}>
              <button className="btn btn-read">Read more</button>
            </Link>
            {userId && item.userId === userId && (
                <div style={{ float: "right" }}>
                <FontAwesomeIcon
                  icon={faTrash}
                  size="2x"
                  onClick={() => handleDelete(item.id)}
                />
                &nbsp; &nbsp;
                <Link to={`/update/${item.id}`}>	
                    <FontAwesomeIcon icon={faPenToSquare} size="2x" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogSection;
