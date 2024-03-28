import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  Image,
  Input,
  Radio,
  RadioGroup,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  if (!events.ok)
    throw new Error(
      `Error while fetching events.json: ${events.status} ${events.statusText}`
    );
  const categories = await fetch("http://localhost:3000/categories");
  if (!categories.ok)
    throw new Error(
      `Error while fetching categories.json: ${categories.status} ${categories.statusText}`
    );
  return { events: await events.json(), categories: await categories.json() };
};

export const EventsPage = () => {
  const { events, categories } = useLoaderData();
  const [searchField, setSearchField] = useState("");
  const [radioValue, setRadioValue] = useState("0");

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  const matchedEvents = events.filter((event) => {
    return event.title.toLowerCase().includes(searchField.toLowerCase());
  });

  const selectedEvents = matchedEvents.filter((event) => {
    if (!Number(radioValue) == 0)
      return event.categoryIds.includes(Number(radioValue));
    else return event;
  });

  return (
    <>
      <Center>
        <Flex pb={10} mx={5} flexDir={"row"}>
          <Input
            w={"30rem"}
            placeholder="Search events"
            textAlign={"left"}
            backgroundColor={"white"}
            onChange={handleChange}
          ></Input>

          <RadioGroup
            alignContent={"center"}
            ml={5}
            color={"white"}
            onChange={setRadioValue}
            value={radioValue.toString()}
          >
            <Flex>
              <Radio key={0} value={"0"} id={0}>
                All
              </Radio>
              {categories.map((category) => (
                <Radio key={category.id} value={category.id.toString()} ml={6}>
                  <Text textTransform={"capitalize"}>{category.name}</Text>
                </Radio>
              ))}
            </Flex>
          </RadioGroup>
        </Flex>
      </Center>
      {selectedEvents.length > 0 ? (
        <Wrap justify={"center"} spacing={38} p={10}>
          {selectedEvents.map((event) => (
            <Card
              key={event.id}
              borderRadius="xl"
              w="sm"
              h="35rem"
              cursor="pointer"
              _hover={{ transform: "scale(1.01)" }}
            >
              <Link ink to={`event/${event.id}`}>
                <CardHeader h={250} p={0}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    boxSize={"100%"}
                    objectFit="cover"
                    borderTopRadius="xl"
                  />
                </CardHeader>

                <CardBody fontSize={"xl"} textAlign={"center"}>
                  <Text fontWeight={"bold"} fontSize={"3xl"}>
                    {event.title}
                  </Text>
                  <Text pt={3}>{event.description}</Text>
                  <Text pt={3}>
                    Start:{" "}
                    {new Date(event.startTime).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour24: true,
                    })}
                  </Text>
                  <Text>
                    End:{" "}
                    {new Date(event.endTime).toLocaleString([], {
                      dateStyle: "short",
                      timeStyle: "short",
                      hour24: true,
                    })}
                  </Text>
                  <Flex wrap="wrap" gap={2} mt={7} justify={"center"}>
                    {categories
                      .filter((category) =>
                        event.categoryIds.includes(category.id)
                      )
                      .map((category) => (
                        <Tag
                          key={category.id}
                          fontSize={"xs"}
                          backgroundColor={"#467fc2"}
                          color={"white"}
                          textTransform={"uppercase"}
                        >
                          {category.name}
                        </Tag>
                      ))}
                  </Flex>
                </CardBody>
              </Link>
            </Card>
          ))}
        </Wrap>
      ) : (
        <Flex justifyContent={"center"}>
          <Center mt={12} mb={12}>
            <Text color={"red.300"} fontWeight={"semibold"} fontSize={"4xl"}>
              No events found
            </Text>
          </Center>
        </Flex>
      )}
    </>
  );
};
