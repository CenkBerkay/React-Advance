import { Box, Center, Flex, Text, Heading } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export const ErrorPage = () => {
  let error = useRouteError();
  console.log(error);
  return (
    <>
      <Box>
        <Center>
          <Flex gap={10} color={"white"} direction={"column"}>
            <Heading mt={20}>An error has occured!</Heading>
            <Box padding color={"red.300"} fontWeight={"bold"}>
              <Text>{error.status}</Text>
              <Text>{error.message}</Text>
              <Text>{error.data}</Text>
            </Box>
            <Text>Check the error message above for what went wrong</Text>
            <Link to={"/"}>
              <Flex direction={"row"}>
                <Text fontSize={"lg"}>
                  Click here to return to the homepage
                </Text>
              </Flex>
            </Link>
          </Flex>
        </Center>
      </Box>
    </>
  );
};
