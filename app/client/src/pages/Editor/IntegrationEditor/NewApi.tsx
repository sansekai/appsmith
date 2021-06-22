import React from "react";
import { connect } from "react-redux";
import { Icon } from "@blueprintjs/core";
import styled from "styled-components";
import { getCurlImportPageURL } from "constants/routes";
import { SAAS_EDITOR_URL } from "pages/Editor/SaaSEditor/constants";
import { AppState } from "reducers";
import { Colors } from "constants/Colors";
import CurlLogo from "assets/images/Curl-logo.svg";
import { Plugin } from "api/PluginApi";
import { createNewApiAction } from "actions/apiPaneActions";
import AnalyticsUtil, { EventLocation } from "utils/AnalyticsUtil";
import { CURL } from "constants/AppsmithActionConstants/ActionConstants";
import { PluginType } from "entities/Action";
import Button, { Category, Size } from "components/ads/Button";

const StyledContainer = styled.div`
  flex: 1;
  margin-top: 8px;
  .textBtn {
    font-size: 16px;
    line-height: 24px;
    margin: 0;
    justify-content: center;
    text-align: center;
    letter-spacing: -0.17px;
    color: ${Colors.OXFORD_BLUE};
    font-weight: 500;
    text-decoration: none !important;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (min-width: 2500px) {
    .textBtn {
      font-size: 18px;
    }
  }
  @media (min-width: 2500px) {
    .eachCard {
      width: 240px;
      height: 200px;
    }
    .apiImage {
      margin-top: 25px;
      margin-bottom: 20px;
      height: 80px;
    }
    .curlImage {
      width: 100px;
    }
    .createIcon {
      height: 70px;
    }
  }
`;

const ApiCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  text-align: center;
  min-width: 150px;
  border-radius: 4px;
  align-items: center;

  .create-new-api {
    &:hover {
      cursor: pointer;
    }
  }
`;

const ApiCard = styled.div`
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding-left: 8px;
  &:hover {
    border: 1px solid #a9a7a7;
  }

  .content-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 0 8px;
    background: #f0f0f0;
    display: flex;
    align-items: center;

    .content-icon {
      height: 28px;
      width: auto;
      margin: 0 auto;
      max-width: 100%;
      margin-bottom: 2px;
    }
  }

  .cta {
    display: none;
    margin-right: 32px;
  }

  &:hover {
    .cta {
      display: flex;
    }
  }
`;

const CardContentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

type ApiHomeScreenProps = {
  applicationId: string;
  createNewApiAction: (pageId: string, from: EventLocation) => void;
  history: {
    replace: (data: string) => void;
    push: (data: string) => void;
  };
  location: {
    search: string;
  };
  pageId: string;
  plugins: Plugin[];
};

type Props = ApiHomeScreenProps;

const newApiScreen = (props: Props) => {
  const {
    applicationId,
    createNewApiAction,
    location,
    pageId,
    plugins,
  } = props;

  const handleCreateNew = () => {
    if (pageId) {
      createNewApiAction(pageId, "API_PANE");
    }
  };
  const curlImportURL =
    getCurlImportPageURL(applicationId, pageId) + location.search;

  return (
    <StyledContainer>
      <ApiCardsContainer>
        <ApiCard
          className="t--createBlankApiCard create-new-api"
          onClick={handleCreateNew}
        >
          <CardContentWrapper>
            <div className="content-icon-wrapper">
              <Icon className="content-icon" icon="plus" iconSize={28} />
            </div>
            <p className="textBtn">Create new</p>
          </CardContentWrapper>
        </ApiCard>
        <ApiCard className="t--createBlankApiCard">
          <CardContentWrapper>
            <div className="content-icon-wrapper">
              <img
                alt="CURL"
                className="curlImage t--curlImage content-icon"
                src={CurlLogo}
              />
            </div>
            <p className="textBtn">CURL</p>
          </CardContentWrapper>
          <Button
            category={Category.tertiary}
            className="t--connect-to-btn cta"
            href={curlImportURL}
            onClick={() => {
              AnalyticsUtil.logEvent("IMPORT_API_CLICK", {
                importSource: CURL,
              });
            }}
            size={Size.medium}
            tag="a"
            text="Create"
          />
        </ApiCard>
        {plugins
          .filter((p) => p.type === PluginType.SAAS)
          .map((p) => (
            <ApiCard className="t--createBlankApiCard" key={p.id}>
              <CardContentWrapper>
                <div className="content-icon-wrapper">
                  <img
                    alt={p.name}
                    className={
                      "content-icon saasImage t--saas-" +
                      p.packageName +
                      "-image"
                    }
                    src={p.iconLocation}
                  />
                </div>
                <p className="textBtn">{p.name}</p>
              </CardContentWrapper>
              <Button
                category={Category.tertiary}
                className="t--connect-to-btn cta"
                href={
                  SAAS_EDITOR_URL(applicationId, pageId, p.packageName) +
                  location.search
                }
                size={Size.medium}
                tag="a"
                text="Connect"
              />
            </ApiCard>
          ))}
      </ApiCardsContainer>
    </StyledContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  plugins: state.entities.plugins.list,
});

const mapDispatchToProps = {
  createNewApiAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(newApiScreen);