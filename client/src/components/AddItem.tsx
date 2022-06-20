import { Button, FormControl, FormErrorMessage, FormLabel, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import InputField from './InputField';
import { Item, ItemType, ItemVariables, OnSubmitFunc } from '../utils/types';
import { ChangeEvent, useState } from 'react';
import { Select } from 'chakra-react-select';
import { ItemSchema } from '../utils/validators';
import FileUpload from './FileUpload';
import { API_URL, ingredientsOptions } from '../utils/vars';

interface AddItemProps {
  isOpen: boolean
  onClose: () => void
  addItemToMenu: (newItem: Item) => void
}

const initialValues = {
  name: '',
  price: 0,
};

const typeOptions = [
  {
    label: 'Apetizer',
    value: ItemType.APETIZER,
  },
  {
    label: 'Club Sandwich',
    value: ItemType.CLUB_SANDWICH
  },
  {
    label: 'Wrap',
    value: ItemType.WRAP
  },
  {
    label: 'Burger',
    value: ItemType.BURGER
  },
  {
    label: 'Dessert',
    value: ItemType.DESSERT
  },
  {
    label: 'Drink',
    value: ItemType.DRINK
  }
];

function AddItem({ isOpen, onClose, addItemToMenu }: AddItemProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<ItemType>(ItemType.APETIZER);
  const [ingredients, setIngredients] = useState<Array<string>>([]);
  const [image, setImage] = useState<File | null | undefined>(null);

  const onSubmit: OnSubmitFunc<ItemVariables> = async (values, { resetForm }) => {
    setIsLoading(true);
    console.log({ values, type, image, ingredients });
    let imageUploadSuccess = false;
    if(image) {
      const formData = new FormData();
      formData.append(
        'image',
        image,
        image.name
      );
      const res = await fetch(`${API_URL}/menu/upload-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }).then(r => r.json());
      if(res.success) {
        imageUploadSuccess = true;
      }
    }

    const res = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...values,
        ingredients,
        type,
        imageUrl: imageUploadSuccess ? image?.name : ''
      }),
      credentials: 'include'
    }).then(r => r.json());

    console.log(res);

    if(res.success) {
      addItemToMenu(res.data.item);
    }

    resetForm();
    setType(ItemType.APETIZER);
    setIngredients([]);
    onClose();
    setIsLoading(false);
  };

  function onChangeFile(e: ChangeEvent<HTMLInputElement>) {
    setImage(e.target.files?.item(0));
  }

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Aggiungi elemento</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={ItemSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) =>
            <Form>
              <ModalBody pb={6}>
                <VStack spacing="6">
                  <FormControl>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      options={typeOptions}
                      name="role"
                      defaultValue={typeOptions[0]}
                      value={typeOptions.find(o => o.value === type)}
                      onChange={co => setType(co?.value as ItemType)}
                      focusBorderColor="yellow.400"
                      selectedOptionStyle='check'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <InputField
                    name="name"
                    errorMessage={errors.name}
                    label="Nome"
                    placeholder='Nome del prodotto'
                    type="text"
                    isInvalid={Boolean(errors.name && touched.name)}
                    isDisabled={isLoading}
                  />
                  <InputField
                    name="price"
                    errorMessage={errors.name}
                    label="Prezzo"
                    type="number"
                    step=".01"
                    formNoValidate
                    isInvalid={Boolean(errors.price && touched.price)}
                    isDisabled={isLoading}
                    min={0}
                  >
                    <InputRightAddon>€</InputRightAddon>
                  </InputField>
                  <FormControl isInvalid={type !== ItemType.DRINK && ingredients.length === 0 && touched.name}>
                    <FormLabel>Ingredienti</FormLabel>
                    <Select
                      options={ingredientsOptions}
                      name="ingredients"
                      isMulti
                      placeholder="Seleziona ingredienti"
                      onChange={arr => setIngredients(arr.map(i => i.value))}
                      focusBorderColor="yellow.400"
                      selectedOptionStyle='check'
                      isDisabled={isLoading}
                    />
                    <FormErrorMessage>Devi selezionare almeno un ingrediente</FormErrorMessage>
                  </FormControl>
                  <FileUpload isDisabled={isLoading} file={image} onChangeFile={onChangeFile} acceptedFileTypes='image/png' name='image' placeholder={'Carica un\'immagine del prodotto'} />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose} mr={3} isDisabled={isLoading}>Annulla</Button>
                <Button colorScheme='yellow' type="submit" isLoading={isLoading} isDisabled={isLoading}>
                  Aggiungi
                </Button>
              </ModalFooter>
            </Form>
          }
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default AddItem;
