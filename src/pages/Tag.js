import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import BlogSection from "../components/BlogSection";

const Tag = () => {
  const [tagBlog, setTagBlog] = useState([]);
  const [loading, setLoading] = useState(false);
  const { tag } = useParams();

  const getTags = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const TagQuery = query(blogRef, where("tags", "array-contains", tag));
    const docSnapshot = await getDocs(TagQuery);
    let tagBlogs = [];
    docSnapshot.forEach((doc) => {
      tagBlogs.push({ id: doc.id, ...doc.data() });
    });

    setTagBlog(tagBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getTags();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Spinner />;
  }


  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="blog-heading text-start py-2 mb-4">
            Tag: <strong>{tag.toLocaleLowerCase()}</strong>
          </div>
          {tagBlog?.map((item) => (
            <div className="col-md-6">
              <BlogSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tag;
