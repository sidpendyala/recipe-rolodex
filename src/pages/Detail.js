import { doc, getDoc } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';

const Detail = ({setActive}) => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    setBlog(blogDetail.data());
    setActive(null);
  }

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <div className="single">
      <div className="blog-title-box" style = {{backgroundImage: `url('${blog?.imgUrl}')`}}>
        <div className="overlay">
          <div className="blog-title">
            <span>
              {blog?.timestamp.toDate().toDateString()}
            </span>
            <h2>{blog?.title}</h2>
          </div>
        </div>
      </div>
      <div className="container db-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p> - &nbsp; 
                {blog?.timestamp.toDate().toDateString()}
              </span>
              <p className="text-start">{blog?.description}</p>
            </div>
            <div className="col-md-3">
              <h2>Tags</h2>
              <h2>Most Popular</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail