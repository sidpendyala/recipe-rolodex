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
import Category from "./Category";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = ({ setActive, user, active }) => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [lastVisible, setLastVisible] = useState(null);
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [hide, setHide] = useState(false);
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const location = useLocation();

  useEffect(() => {
    setSearch("");
    const unsub = onSnapshot(
      collection(db, "recipes"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          tags.push(...doc.get("tags"));
          list.push({ id: doc.id, ...doc.data() });
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setTotalBlogs(list);
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
    const blogRef = collection(db, "recipes");
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
      toast.info("No more recipes to display!");
      setHide(true);
    }
  }

  const fetchMore = async () => {
    setLoading(true);
    const blogRef = collection(db, "recipes");
    const next4 = query(blogRef, orderBy("title"), limit(4), startAfter(lastVisible));
    const docSnapshot = await getDocs(next4);
    updateState(docSnapshot);
    setLoading(false);
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    }
    // eslint-disable-next-line
    }, [searchQuery]);

  if (loading) {
    return <Spinner />;
  }

  const searchBlogs = async () => {
    const blogRef = collection(db, "recipes");
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
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "recipes", id));
        toast.success("Recipe deleted successfully.");
        getBlogs();
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

  const counts = totalBlogs.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if(!prevValue.hasOwnProperty(name)){
      prevValue[name] = 0;
    }
    prevValue[name]++
    delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k]
    }
  })

  return (
    <div className="container-fluid pb-4 pt-4 padding">
      <div className="container padding">
        <div className="row mx-0">
          <div className="col-md-8">
          <div className="blog-heading text-start py-2 mb-4">Daily Recipes</div>
          {blogs.length === 0  && location.pathname !== "/" && (
              <>
              <h4>
                No recipes found with search keyword: &nbsp;
              <strong>{searchQuery}</strong>
              </h4>
              </>
            )}
            {blogs?.map((blog) =>(
            <BlogSection
              blogs={blogs}
              user={user}
              handleDelete={handleDelete}
              {...blog}
            />
            ))}
            {!hide && (
              <button className="btn btn-primary" onClick={fetchMore}>Load more</button>
            )}
          </div>
          <div className="col-md-3">
            <Search search={search} handleChange={handleChange} />
            <Tags tags={tags} />
            <Category catBlogsCount={categoryCount}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
