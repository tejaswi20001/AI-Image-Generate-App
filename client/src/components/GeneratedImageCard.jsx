import React from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

const Container = styled.div`
  flex: 1;
  min-height: 300px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${({ theme }) => theme.yellow};
  color: ${({ theme }) => theme.arrow + 80};
  border-radius: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  background: ${({ theme }) => theme.black + 50};
`;

const GeneratedImage = ({ src, loading }) => {
  return (
    <Container>
      {loading ? (
        <>
          <CircularProgress
            style={{ color: "inherit", width: "24px", height: "24px" }}
          />
          Generating Your Image ...
        </>
      ) : (
        <>
          {src ? (
            <Image src={src} />
          ) : (
            <>Write a prompt to generate the image that you want</>
          )}
        </>
      )}
    </Container>
  );
};

export default GeneratedImage;
