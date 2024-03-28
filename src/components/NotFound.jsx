import { Text, Heading, Center, Flex, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <Box h={500}>
        <Center>
          <Flex color={"white"} gap={10} direction={"column"}>
            <Heading fontSize={"6xl"} mt={20}>
              404 Error
            </Heading>
            <Heading>This page cannot be found!</Heading>

            <Link to={"/"}>
              <Text fontSize={"lg"}>Click here to return to the homepage</Text>
            </Link>
          </Flex>
        </Center>
      </Box>
    </>
  );
};
