import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DeleteEvent = ({ isOpen, onClose, event }) => {
  const cancelRef = useRef();
  const toast = useToast();
  const id = "delete-event-toast";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deleteEvent = async () => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });
      toast({
        id,
        title: "Event has been deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        id,
        description: "Error while deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent alignItems={"center"}>
            <AlertDialogHeader
              pb={2}
              fontSize="xl"
              fontWeight="bold"
              textTransform={"uppercase"}
              textColor={"red.600"}
            >
              Deleting event
            </AlertDialogHeader>
            <AlertDialogBody fontWeight={"semibold"}>
              Are you sure you want to delete this event?{" "}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Flex gap={5}>
                <Button
                  color={"white"}
                  onClick={deleteEvent}
                  fontSize={"lg"}
                  backgroundColor={"red.500"}
                  _hover={{ backgroundColor: "red.700" }}
                  isLoading={loading}
                >
                  Delete
                </Button>
                <Button
                  color={"white"}
                  ref={cancelRef}
                  onClick={onClose}
                  fontSize={"lg"}
                  backgroundColor={"blue.300"}
                  _hover={{ backgroundColor: "blue.500" }}
                  isLoading={loading}
                >
                  Cancel
                </Button>
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
