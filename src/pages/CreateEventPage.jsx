import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Button,
  Center,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
  Box,
  FormLabel,
} from "@chakra-ui/react";

export const loader = async () => {
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
    categories: await categories.json(),
    users: await users.json(),
  };
};

export const CreateEventPage = () => {
  const { categories, users } = useLoaderData();
  const navigate = useNavigate();
  const toast = useToast();
  const toastId = "create-event-toast";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [userId, setUserId] = useState("");

  const [loading, setLoading] = useState(false);
  const [keyForm, setKeyForm] = useState(0);

  const getCurrentDateTime = () => {
    let date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const convertLocalToUTC = (localDateString) => {
    let date = new Date(localDateString);
    return new Date(date.getTime()).toISOString();
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      setCategoryIds([...categoryIds, Number(event.target.id)]);
    } else {
      setCategoryIds(categoryIds.filter((id) => id != event.target.id));
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleResetButton = () => {
    setCategoryIds([]);
    setKeyForm((prev) => prev + 1);
  };

  const addEvent = async (event) => {
    event.preventDefault();
    if (categoryIds.length < 1) {
      window.alert("One or more categories are required !");
      return;
    }
    if (endDateTime <= startDateTime) {
      window.alert("The end date/time must be after the start date/time !");
      return;
    }

    setLoading(true);
    const startDateTimeUTC = convertLocalToUTC(startDateTime);
    const endDateTimeUTC = convertLocalToUTC(endDateTime);
    const newEvent = {
      id: undefined,
      createdBy: userId,
      title: title,
      description: description,
      image: imageUrl,
      categoryIds: categoryIds,
      location: location,
      startTime: startDateTimeUTC,
      endTime: endDateTimeUTC,
    };

    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify(newEvent),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (response.ok) {
      toast({
        toastId,
        title: "Added successfully",
        description: "The event has been successfully added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const newEventId = (await response.json()).id;
      navigate(`/event/${newEventId}`);
    } else {
      console.error(`Error updating event: ${response.statusText}`);
      toast({
        toastId,
        title: "Added not succesfully",
        description: "The event has not been added, an error has occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Center
        color={"white"}
        fontSize={"3xl"}
        fontWeight={"medium"}
        pt={1}
        pb={2}
      >
        Create a new Event:
      </Center>
      <Center color={"white"}>
        <form id="form-create-event" key={keyForm} onSubmit={addEvent}>
          <Flex gap={4} flexDirection={"column"}>
            <Box>
              <FormLabel>Title: </FormLabel>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
                isRequired
                placeholder="title of the event"
                backgroundColor={"white"}
                color={"black"}
              ></Input>
            </Box>

            <Box>
              <FormLabel>Description:</FormLabel>
              <Textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                rows={4}
                required
                placeholder="description"
                backgroundColor={"white"}
                color={"black"}
              ></Textarea>
            </Box>

            <Box>
              <FormLabel>Image URL: `</FormLabel>
              <Input
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
                required
                rows={1}
                placeholder="Image URL"
                backgroundColor={"white"}
                color={"black"}
              ></Input>
            </Box>

            <Box>
              <FormLabel>Location:</FormLabel>
              <Input
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                required
                rows={1}
                placeholder="location"
                backgroundColor={"white"}
                color={"black"}
              ></Input>
            </Box>

            <Box>
              <FormLabel fontWeight={"semibold"}>Start Date/time:</FormLabel>
              <Input
                type="datetime-local"
                required
                placeholder="Select Date and Time"
                size="md"
                onChange={(e) => setStartDateTime(e.target.value)}
                min={getCurrentDateTime()}
                backgroundColor={"white"}
                color={"gray.600"}
                fontWeight={"semibold"}
                mt={0}
              ></Input>
            </Box>

            <Box>
              <FormLabel fontWeight={"semibold"}>End Date/time:</FormLabel>
              <Input
                type="datetime-local"
                required
                placeholder="Select Date and Time"
                size="md"
                onChange={(e) => setEndDateTime(e.target.value)}
                min={getCurrentDateTime()}
                backgroundColor={"white"}
                color={"gray.600"}
                fontWeight={"semibold"}
              ></Input>
            </Box>
            <Box>
              <FormLabel>User:</FormLabel>
              <Select
                color={"gray.600"}
                placeholder="Select user"
                backgroundColor={"white"}
                fontWeight={"semibold"}
                onChange={(e) => setUserId(Number(e.target.value))}
                isRequired
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <CheckboxGroup colorScheme="blue" isRequired>
                <Text fontWeight={"semibold"}>Select categories:</Text>
                <Flex gap={7}>
                  {categories.map((category) => (
                    <Checkbox
                      key={category.id}
                      onChange={handleCheckBox}
                      name={category.name}
                      id={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </Checkbox>
                  ))}
                </Flex>
              </CheckboxGroup>
            </Box>
          </Flex>

          <Flex mt={5} gap={7}>
            <Button
              type="submit"
              id="form-create-event"
              color={"#467fc2"}
              w={32}
              backgroundColor={"white"}
              isLoading={loading}
            >
              Add
            </Button>
            <Button
              type="reset"
              form="form-create-event"
              onClick={handleResetButton}
              color={"#467fc2"}
              w={32}
              backgroundColor={"white"}
              isLoading={loading}
            >
              Reset
            </Button>
            <Button
              type="button"
              form="form-create-event"
              onClick={handleCancel}
              color={"#467fc2"}
              w={32}
              backgroundColor={"white"}
              isLoading={loading}
            >
              Cancel
            </Button>
          </Flex>
        </form>
      </Center>
    </>
  );
};
