import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
  orderBy,
  startAfter
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Tags from "../components/Tags";
import Search from "../components/Search";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  useEffect(() => {
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);
        setLoading(false);
        setActive("home");
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [setActive, active]);

  useEffect(() => {
    getBlogs();
  }, [active]);

  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const first4 = query(blogRef, orderBy("title"), limit(4));
    const docSnapshot = await getDocs(first4);
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
  };

  const updateState = (docSnapshot) => {
    const isCollectionEmpty = docSnapshot.size === 0;
    if (!isCollectionEmpty) {
      const blogsData = docSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setBlogs((blogs) => [...blogs, ...blogsData]);
      setLastVisible(docSnapshot.docs[docSnapshot.docs.length - 1]);
    } else {
      toast.info("No more blogs to display!");
      setHide(true);
    }
  }

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "blogs");
    const next4 = query(blogRef, orderBy("title"), limit(4), startAfter(lastVisible));
    const docSnapshot = await getDocs(next4);
    updateState(docSnapshot);
    setLoading(false);
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

  if (loading) {
    return <Spinner />;
  }

  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitleQuery = query(blogRef, where("title", "==", searchQuery));
    const searchTagQuery = query(blogRef, where("tags", "array-contains", searchQuery));
    const titleSnapshot = await getDocs(searchTitleQuery);
    const tagSnapshot = await getDocs(searchTagQuery);
    let searchTitleBlogs = [];
    let searchTagBlogs = [];
    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({ id: doc.id, ...doc.data() });
    });
    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({ id: doc.id, ...doc.data() });
    });
    const combinedSearch = searchTitleBlogs.concat(searchTagBlogs);
    setBlogs(combinedSearch);
    setHide(true);
    setActive("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully.");
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
  };


  const handleChange = (e) => {
    const { value } = e.target;
    if (isEmpty(value)) {
      getBlogs();
      setHide(false)
    }
    setSearch(value);
  };

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <div className="col-md-8">
          <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
          {blogs.length === 0  && location.pathname !== "/" && (
              <>
              <h4>
                No blogs found with search keyword: &nbsp;
              <strong>{searchQuery}</strong>
              </h4>
              </>
            )}
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
            />
            {!hide && (
              <button className="btn btn-primary" onClick={fetchMore}>Load more</button>
            )}
          </div>
          <div className="col-md-3">
            <Search search={search} handleChange={handleChange} />
            <Tags tags={tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
