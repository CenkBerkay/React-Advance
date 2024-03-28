import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Link, useLoaderData } from "react-router-dom";
import { EditEvent } from "../components/EditEvent";
import { useState } from "react";
import { DeleteEvent } from "../components/DeleteEvent";

export const loader = async ({ params }) => {
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  if (!event.ok) {
    throw new Error(
      `Error while fetching this event: ${event.status} ${event.statusText}`
    );
  }
  const categories = await fetch("http://localhost:3000/categories");
  if (!categories.ok) {
    throw new Error(
      `Error while fetching the categories: ${categories.status} ${categories.statusText}`
    );
  }
  const users = await fetch("http://localhost:3000/users");
  if (!users.ok) {
    throw new Error(
      `Error while fetching the users: ${users.status} ${users.statusText}`
    );
  }
  return {
    event: await event.json(),
    categories: await categories.json(),
    users: await users.json(),
  };
};

export const EventPage = () => {
  const { event, categories, users } = useLoaderData();
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(event);

  return (
    <>
      <Center>
        <Box w={"50vw"} bg={"white"} borderRadius={"xl"} mt={1}>
          <Flex justifyContent="space-between">
            <Box>
              <Link to={`/`}>
                <Button ml={3} mt={3} h={"4em"} textColor={"gray.600"}>
                  Back
                </Button>
              </Link>
            </Box>
            <Box>
              <Heading fontWeight={"bold"} pb={6} pt={6}>
                {currentEvent.title}
              </Heading>
            </Box>
            <Box w={100}></Box>
          </Flex>

          <Box w={"100%"} h={"300px"} mt={2} mb={4}>
            <Image
              src={currentEvent.image}
              alt={currentEvent.title}
              borderRadius={"sm"}
              boxSize={"100%"}
              objectFit={"cover"}
              objectPosition={"center"}
            ></Image>
          </Box>

          <Flex flexDirection={"column"} justifyContent={"center"}>
            <Box p={8}>
              <Center>
                <Text
                  fontSize={"3xl"}
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                >
                  {currentEvent.description}
                </Text>
              </Center>

              <Center>
                <Flex mt={5}>
                  <Text fontSize={"2xl"} fontWeight={"bold"}>
                    Location:
                  </Text>
                  <Text fontSize={"2xl"} fontWeight={"semibold"} pl={2}>
                    {currentEvent.location}
                  </Text>
                </Flex>
              </Center>

              <Center>
                <Flex flexDir={"column"}>
                  <Flex mt={2} flexDir={"row"}>
                    <Text pt={3} fontSize={"xl"} fontWeight={"bold"}>
                      Starts at:
                    </Text>
                    <Text pt={3} pl={4} fontSize={"xl"} fontWeight={"semibold"}>
                      {new Date(currentEvent.startTime).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                        hour24: true,
                      })}
                    </Text>
                  </Flex>
                  <Flex flexDir={"row"}>
                    <Text pt={3} fontSize={"xl"} fontWeight={"bold"}>
                      Ends at:
                    </Text>
                    <Text pt={3} pl={6} fontSize={"xl"} fontWeight={"semibold"}>
                      {new Date(currentEvent.endTime).toLocaleString([], {
                        dateStyle: "short",
                        timeStyle: "short",
                        hour24: true,
                      })}
                    </Text>
                  </Flex>
                </Flex>
              </Center>

              <Center mt={5}>
                <Text fontSize={"xl"} fontWeight={"bold"}>
                  Created by:
                </Text>
                {users
                  .filter((user) => user.id == currentEvent.createdBy)
                  .map((user) => (
                    <Text
                      key={user.id}
                      fontSize={"xl"}
                      fontWeight={"semibold"}
                      pl={3}
                      pr={3}
                    >
                      {user.name}
                    </Text>
                  ))}
                {users
                  .filter((user) => user.id == currentEvent.createdBy)
                  .map((user) => (
                    <Image
                      key={() => user.name + user.id}
                      src={user.image}
                      alt={user.name}
                      boxSize={"6em"}
                      objectFit={"cover"}
                      borderRadius={"50%"}
                      m={2}
                    ></Image>
                  ))}
              </Center>
              <Center>
                <Flex wrap="wrap" gap={2} mt={7} justify={"center"}>
                  {categories
                    .filter((category) =>
                      event.categoryIds.includes(category.id)
                    )
                    .map((category) => (
                      <Tag
                        key={category.id}
                        backgroundColor={"#467fc2"}
                        color={"white"}
                        textTransform={"uppercase"}
                      >
                        {category.name}
                      </Tag>
                    ))}
                </Flex>
              </Center>
            </Box>
            <Flex pb={5} mr={5} justifyContent={"flex-end"}>
              <Box>
                <Button
                  w={24}
                  mr={5}
                  color={"white"}
                  fontSize={"lg"}
                  backgroundColor={"blue.300"}
                  _hover={{ backgroundColor: "blue.500" }}
                  onClick={() => setModalEditOpen(true)}
                >
                  Edit
                </Button>

                <Button
                  w={24}
                  color={"white"}
                  fontSize={"lg"}
                  backgroundColor={"blue.300"}
                  _hover={{ backgroundColor: "blue.500" }}
                  onClick={() => setAlertDeleteOpen(true)}
                >
                  Delete
                </Button>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <EditEvent
          isOpen={modalEditOpen}
          onClose={() => {
            setModalEditOpen(false);
          }}
          mainEvent={currentEvent}
          setMainEvent={setCurrentEvent}
          categories={categories}
        ></EditEvent>

        <DeleteEvent
          isOpen={alertDeleteOpen}
          onClose={() => {
            setAlertDeleteOpen(false);
          }}
          event={currentEvent}
        ></DeleteEvent>
      </Center>
    </>
  );
};
