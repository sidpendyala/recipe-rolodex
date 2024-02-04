import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import BlogSection from "../components/BlogSection";

const Cat = () => {
  const [cat, setCat] = useState([]);
  const [loading, setLoading] = useState(false);
  const { category } = useParams();

  const getCat = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const catQuery = query(blogRef, where("category", "==", category));
    const docSnapshot = await getDocs(catQuery);
    let catBlogs = [];
    docSnapshot.forEach((doc) => {
      catBlogs.push({ id: doc.id, ...doc.data() });
    });

    setCat(catBlogs);
    setLoading(false);
  };

  useEffect(() => {
    getCat();
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
            Category: <strong>{category.toLocaleLowerCase()}</strong>
          </div>
          {cat?.map((item) => (
            <div className="col-md-6">
              <BlogSection key={item.id} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cat;
