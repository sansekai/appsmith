import React from "react";
import styled from "styled-components";
import PageUnavailableImage from "assets/images/404-image.png";

const Wrapper = styled.div`
  /* comment are not format automatically */
  height: calc(100vh - ${(props) => props.theme.headerHeight});
  background-color: #fafafa;
  text-align: center;
  padding-top: calc(${(props) => props.theme.headerHeight} + 50px);
  .bold-text {
    font-weight: ${(props) => props.theme.fontWeights[3]};
    font-size: 24px;
  }
  .page-unavailable-img {
    width: 45%;
  }
  .button-position {
    margin: auto;
  }
`;
const RetryButton = styled.button`
  /* background-color: #7b7b91; */
  color: #434343;
  height: 40px;
  min-width: 250px;
  box-shadow: 1.5px 2.5px 1px #545454, 3px 5px 1px #545454;
  border-width: 0.1em;
  border-color: #8f8f8f;
  border-radius: 0.3rem;
  cursor: pointer;
  font-weight: 900;
  font-size: 16px;
`;

function ServerUnavailable() {
  return (
    <Wrapper>
      <img
        alt="Page Unavailable"
        className="page-unavailable-img"
        src={PageUnavailableImage}
      />
      <div>
        <h1>Lol ssda</h1>
        <p className="bold-text">Appsmith server is unavailable</p>
        <p>Please try again after some time</p>
        <RetryButton onClick={() => window.location.reload()}>
          {"Retry"}
        </RetryButton>
      </div>
    </Wrapper>
  );
}

export default ServerUnavailable;
