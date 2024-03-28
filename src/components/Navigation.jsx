import React from "react";
import { Link } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <>
      <Flex p={5}>
        <Link to={`/`}>
          <Button color={"#467fc2"} fontSize={"lg"} borderRadius={"md"}>
            Home
          </Button>
        </Link>
        <Link to={`/new`}>
          <Button color={"#467fc2"} ml={5} fontSize={"lg"} borderRadius={"md"}>
            Add Event
          </Button>
        </Link>
      </Flex>
    </>
  );
};
