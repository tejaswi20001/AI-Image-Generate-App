import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import ImageCard from "../components/ImageCard";
import Searchbar from "../components/Searchbar";
import { GetPosts } from "../apis";

const Container = styled.div`
  height: 100%;
  overflow-y: scroll;
  padding: 30px 30px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;

const HeadLine = styled.div`
  font-size: 34px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: center;
  flex-direction: column;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const Span = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.secondary};

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 0px;
  display: flex;
  justify-content: center;
`;

const CardWrapper = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 640px) and (max-width: 1199px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 639px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const getPosts = async () => {
    setLoading(true);

    await GetPosts()
      .then((res) => {
        setLoading(false);
        setPosts(res?.data?.data || []);
        setFilteredPosts(res?.data?.data || []);
      })
      .catch((error) => {
        setLoading(false);
        setError(error?.response?.data?.message || "Something went wrong");
      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredPosts(posts);
      return;
    }

    const filteredPosts = posts.filter(
      (item) =>
        item.author?.toLowerCase().includes(search.toLowerCase()) ||
        item.prompt?.toLowerCase().includes(search.toLowerCase()),
    );
    if (search) {
      setFilteredPosts(filteredPosts);
    }
  }, [search, posts]);

  return (
    <Container>
      <HeadLine>
        <Span>💠 Generated with AI</Span>
      </HeadLine>

      <Searchbar search={search} setSearch={setSearch} />

      <Wrapper>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {filteredPosts.length === 0 ? (
              <>No Posts Found</>
            ) : (
              filteredPosts.map((item, index) => (
                <ImageCard key={item._id || index} item={item} />
              ))
            )}
          </CardWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

export default Home;
