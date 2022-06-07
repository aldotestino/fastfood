import { Icon, IconButton, ListItem, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, UnorderedList } from '@chakra-ui/react';
import { InformationCircleIcon } from '@heroicons/react/outline';

interface IngredientsProps {
  ingredients: Array<string>
}

function Ingredients({ ingredients }: IngredientsProps) {
  return (
    <Popover placement="top-start">
      <PopoverTrigger>
        <IconButton variant="ghost" aria-label='ingredients' icon={<Icon as={InformationCircleIcon} />} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Ingredienti</PopoverHeader>
        <PopoverBody>
          <UnorderedList>
            {ingredients.map((ing, i) => <ListItem key={i}>{ing}</ListItem>)}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default Ingredients;