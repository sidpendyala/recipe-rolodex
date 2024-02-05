import { Timestamp, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase';
import Related from './Related';
import Tags from '../components/Tags';
import { isEmpty } from 'lodash';
import Comments from '../components/Comments';
import Comment from '../components/Comment';
import { toast } from 'react-toastify';

const Detail = ({setActive, user}) => {
  const userId = user?.uid;
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]); 
  const [userComment, setUserComment] = useState("");
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const getBlogDetail = async () => {
    const blogRef = collection(db, "blogs");
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef);
    setBlog(blogDetail.data());
    const relatedBlogsQuery = query(blogRef, where("tags", "array-contains-any", blogDetail.data().tags, limit(3)));
    setComments(blogDetail.data().comments ? blogDetail.data().comments : []);
    const relatedBlogsSnapshot = await getDocs(relatedBlogsQuery);
    const relatedBlogs = [];
    relatedBlogsSnapshot.forEach((doc) => {
      relatedBlogs.push({id: doc.id, ...doc.data()})
    });
    setRelatedBlogs(relatedBlogs);
    setActive(null);
  }

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line
  }, [id])

  const handleComment = async (e) => {
    e.preventDefault();
    comments.push({
      createdAt: Timestamp.fromDate(new Date()),
      userId,
      name: user?.displayName,
      body: userComment,
    });
    toast.success("Comment posted successfully.");
    await updateDoc(doc(db, "blogs", id), {
      ...blog,
      comments,
      timestamp: serverTimestamp(),
    });
    setComments(comments);
    setUserComment("")
  };

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
              <br />
            <div className='custombox'>
              <h4 className='small-title'>
                {blog?.comments?.length} comment(s)
               </h4>
               {isEmpty(comments) ? (
                <Comments msg={"No comments yet! Be the first to comment."}/>
               ) : (
               <>
               {comments?.map((comment) => (
                <Comments {...comment}/>
               ))}
               </>
               )}
            </div>
            <Comment userId={userId} userComment={userComment} setUserComment={setUserComment} handleComment={handleComment}/>
            </div>
            <div className="col-md-3">
              <Tags tags={blog?.tags}/>
              <Related id={id} blogs={relatedBlogs}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail