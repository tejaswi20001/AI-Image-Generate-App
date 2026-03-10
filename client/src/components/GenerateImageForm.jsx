import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./Button";
import TextInput from "./TextInput";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import { CreatePost, GenerateAIImage } from "../apis";

const Form = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 9%;
  justify-content: center;
`;
const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6%;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Description = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18%;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Actions = styled.div`
  flex: 1;
  display: flex;
  gap: 8%;
  margin-top: 25px;
`;

const GenerateImageForm = ({
  post,
  setPost,
  generateImageLoading,
  setGenerateImageLoading,
  createPostLoading,
  setCreatePostLoading,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleGenerateImageLoading = async () => {
    try {
      setGenerateImageLoading(true);

      const res = await GenerateAIImage({ prompt: post.prompt });

      setPost({
        ...post,
        photo: res?.data?.photo,
      });
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setGenerateImageLoading(false);
    }
  };

  const handleCreatePostImageLoading = async () => {
    setCreatePostLoading(true);

    await CreatePost(post)
      .then(() => {
        setCreatePostLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setCreatePostLoading(false);
        setError(error?.response?.data?.message);
      });
  };

  return (
    <Form>
      <Top>
        <Title>Generate Image with prompt</Title>
        <Description>
          Write your prompt according to the image you want to generate
        </Description>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter your name.."
          name="name"
          value={post.author}
          handelChange={(e) => setPost({ ...post, author: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Write a prompt about the image you want to generate. . ."
          name="name"
          rows="8"
          textArea
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Body>
      <Actions>
        <Button
          text="Genetate Image"
          flex
          leftIcon={<AutoAwesomeIcon />}
          isLoading={generateImageLoading}
          isDisabled={post?.prompt === ""}
          onClick={handleGenerateImageLoading}
        />
        <Button
          text="Post Image"
          flex
          type="secondary"
          leftIcon={<CreateRoundedIcon />}
          isLoading={createPostLoading}
          isDisabled={
            post?.author === "" || post?.prompt === "" || post?.photo === ""
          }
          onClick={handleCreatePostImageLoading}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImageForm;
