import { Button, FormControl, FormLabel, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import InputField from './InputField';
import { Item, ItemType, ItemVariables, OnSubmitFunc } from '../utils/types';
import { ChangeEvent, useState } from 'react';
import { Select } from 'chakra-react-select';
import { ItemSchema } from '../utils/validators';
import FileUpload from './FileUpload';
import { API_URL, ingredientsOptions } from '../utils/vars';

export interface ItemInitialValues {
  name: string
  price: number
  ingredients: Array<string>
  imageUrl: string
  type: ItemType
}

interface CreateOrUpdateItemProps {
  action: 'create' | 'update'
  initialValues: ItemInitialValues
  isOpen: boolean
  itemId?: string
  onClose: () => void
  addItemToMenu?: (newItem: Item) => void
  updateItem?: (updatedItem: Item) => void
}

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

function CreateOrUpdateItem({ action, itemId, initialValues, isOpen, onClose, addItemToMenu, updateItem }: CreateOrUpdateItemProps) {
  
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<ItemType>(initialValues.type);
  const [ingredients, setIngredients] = useState<Array<string>>(initialValues.ingredients);
  const [image, setImage] = useState<File | null | undefined>(null);

  const handleUpdateItem: OnSubmitFunc<ItemVariables> = async (values) => {
    setIsLoading(true);
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

    const res = await fetch(`${API_URL}/menu/${itemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...values,
        ingredients,
        type,
        imageUrl: imageUploadSuccess ? image?.name : initialValues.imageUrl
      }),
      credentials: 'include'
    }).then(r => r.json());

    setIsLoading(false);

    if(res.success) {
      if(updateItem) {
        updateItem(res.data.item);
      }
    }
    
    handleOnClose();
  };

  const handleCreateItem: OnSubmitFunc<ItemVariables> = async (values) => {
    setIsLoading(true);
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

    setIsLoading(false);
    
    if(res.success) {
      if(addItemToMenu) {
        addItemToMenu(res.data.item);
      }
    }

    onClose();
  };

  function onChangeFile(e: ChangeEvent<HTMLInputElement>) {
    setImage(e.target.files?.item(0));
  }

  function handleOnClose() {
    setType(initialValues.type);
    setIngredients(initialValues.ingredients);
    onClose();
  }

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={handleOnClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{action === 'create' ? 'Aggiungi elemento' : 'Aggiorna elemento'}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ name: initialValues.name, price: initialValues.price }}
          validateOnBlur={false}
          validationSchema={ItemSchema}
          onSubmit={action === 'create' ? handleCreateItem : handleUpdateItem}
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
                      defaultValue={typeOptions.find(t => t.value === initialValues.type)}
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
                  <FormControl>
                    <FormLabel>Ingredienti</FormLabel>
                    <Select
                      options={ingredientsOptions}
                      name="ingredients"
                      defaultValue={initialValues.ingredients.map(i => ({ label: i, value: i }))}
                      isMulti
                      placeholder="Seleziona ingredienti"
                      onChange={arr => setIngredients(arr.map(i => i.value))}
                      focusBorderColor="yellow.400"
                      selectedOptionStyle='check'
                      isDisabled={isLoading}
                    />
                  </FormControl>
                  <FileUpload oldValue={initialValues.imageUrl} isDisabled={isLoading} file={image} onChangeFile={onChangeFile} acceptedFileTypes='image/png' name='image' placeholder={'Carica un\'immagine del prodotto'} />
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={handleOnClose} mr={3} isDisabled={isLoading}>Annulla</Button>
                <Button colorScheme='yellow' type="submit" isLoading={isLoading} isDisabled={isLoading}>
                  {action === 'create' ? 'Aggiungi' : 'Aggiorna'}
                </Button>
              </ModalFooter>
            </Form>
          }
        </Formik>
      </ModalContent>
    </Modal>
  );
}

export default CreateOrUpdateItem;
