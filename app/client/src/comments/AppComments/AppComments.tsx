import React, { useState } from "react";
import { useSelector } from "react-redux";
import { commentModeSelector } from "selectors/commentsSelectors";
import AppCommentsHeader from "./AppCommentsHeader";
import AppCommentThreads from "./AppCommentThreadsContainer";
import Container from "./Container";
import { useCallback } from "react";

const AppComments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isCommentMode = useSelector(commentModeSelector);
  const onClose = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!isCommentMode) return null;

  return (
    <Container>
      <AppCommentsHeader
        onClose={onClose}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <AppCommentThreads isOpen={isOpen} />
    </Container>
  );
};

export default AppComments;
