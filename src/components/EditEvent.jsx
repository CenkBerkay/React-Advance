import {
  Button,
  Checkbox,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Textarea,
  useToast,
  Flex,
  Box,
} from "@chakra-ui/react";

import { useState } from "react";

export const EditEvent = ({
  isOpen,
  onClose,
  mainEvent,
  setMainEvent,
  categories,
}) => {
  const toast = useToast();
  const toastId = "edit-event-toast";

  const [title, setTitle] = useState(mainEvent.title);
  const [description, setDescription] = useState(mainEvent.description);
  const [imageUrl, setImageUrl] = useState(mainEvent.image);
  const [categoryIds, setCategoryIds] = useState(mainEvent.categoryIds);
  const [location, setLocation] = useState(mainEvent.location);
  const [startDateTime, setStartDateTime] = useState(mainEvent.startTime);
  const [endDateTime, setEndDateTime] = useState(mainEvent.endTime);
  const [loading, setLoading] = useState(false);

  // Convert UTC-date/time from to local-date/time
  const convertUTCToLocal = (utcDateString) => {
    if (utcDateString === "") {
      // clear (wissen) !
      return (utcDateString = "0001-01-01T00:00:00.000Z");
    }
    let date = new Date(utcDateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  // Convert local-date/time to UTC date/time
  const convertLocalToUTC = (localDateString) => {
    let date = new Date(localDateString);
    return new Date(date.getTime()).toISOString();
  };

  const handleCheckBox = (e) => {
    if (e.target.checked) {
      setCategoryIds([...categoryIds, Number(e.target.id)]);
    } else {
      setCategoryIds(categoryIds.filter((id) => id != e.target.id));
    }
  };

  const handleCancel = () => {
    setTitle(mainEvent.title);
    setDescription(mainEvent.description);
    setImageUrl(mainEvent.image);
    setCategoryIds(mainEvent.categoryIds);
    setLocation(mainEvent.location);
    setStartDateTime(mainEvent.startTime);
    setEndDateTime(mainEvent.endTime);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const eventData = {
      id: mainEvent.id,
      createdBy: mainEvent.createdBy,
      title: title,
      description: description,
      image: imageUrl,
      categoryIds: categoryIds,
      location: location,
      startTime: startDateTimeUTC,
      endTime: endDateTimeUTC,
    };

    const response = await fetch(
      `http://localhost:3000/events/${mainEvent.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      }
    );

    setLoading(false);
    if (response.ok) {
      setMainEvent(eventData);
      onClose();
      toast({
        toastId,
        title: "Update success",
        description: "the event has been successfully updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      console.error(`Error updating event: ${response.statusText}`);
      onClose();
      toast({
        toastId,
        title: "Update failed",
        description: "An error occurred during the update",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            align={"center"}
            fontSize="xl"
            fontWeight="bold"
            textTransform={"uppercase"}
          >
            Edit Event
          </ModalHeader>

          <ModalBody>
            <form id="form-edit-event" onSubmit={handleSubmit}>
              <Flex gap={7} flexDirection={"column"}>
                <Box>
                  <FormLabel>Title: </FormLabel>
                  <Input
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                    isRequired
                    placeholder="title of the event"
                    backgroundColor={"blackAlpha.100"}
                    textColor={"black"}
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
                    backgroundColor={"blackAlpha.100"}
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
                    backgroundColor={"blackAlpha.100"}
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
                    backgroundColor={"blackAlpha.100"}
                  ></Input>
                </Box>

                <Box>
                  <FormLabel>Start Date/time:</FormLabel>
                  <Input
                    type="datetime-local"
                    value={convertUTCToLocal(startDateTime)}
                    required
                    placeholder="Select Date and Time"
                    onChange={(e) => setStartDateTime(e.target.value)}
                    backgroundColor={"blackAlpha.100"}
                    color={"gray.600"}
                    fontWeight={"semibold"}
                  ></Input>
                </Box>

                <Box>
                  <FormLabel>End Date/time:</FormLabel>
                  <Input
                    type="datetime-local"
                    value={convertUTCToLocal(endDateTime)}
                    required
                    placeholder="Select Date and Time"
                    size="md"
                    onChange={(e) => setEndDateTime(e.target.value)}
                    backgroundColor={"blackAlpha.100"}
                    color={"gray.600"}
                    fontWeight={"semibold"}
                  ></Input>
                </Box>

                <Box>
                  <FormLabel ml={1}>Categories:</FormLabel>
                  <Flex gap={10}>
                    {categories.map((category) => (
                      <Checkbox
                        textTransform={"capitalize"}
                        key={category.id}
                        onChange={(e) => handleCheckBox(e)}
                        name={category.name}
                        id={category.id}
                        value={category.name}
                        isChecked={categoryIds.includes(category.id)}
                        borderColor={"gray.500"}
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              form="form-edit-event"
              w={24}
              mr={5}
              color={"white"}
              fontSize={"lg"}
              borderRadius={"md"}
              backgroundColor={"blue.300"}
              _hover={{ backgroundColor: "blue.500" }}
              isLoading={loading}
            >
              Save
            </Button>

            <Button
              type="button"
              form="form-edit-event"
              onClick={handleCancel}
              w={24}
              color={"white"}
              fontSize={"lg"}
              borderRadius={"md"}
              backgroundColor={"blue.300"}
              _hover={{ backgroundColor: "blue.500" }}
              isLoading={loading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
