import { FormControl, FormLabel, Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { PhotographIcon } from '@heroicons/react/outline';
import { useRef, ChangeEvent, RefObject } from 'react';

interface FileUploadProps {
  isDisabled: boolean
  acceptedFileTypes: string
  name: string,
  placeholder: string
  oldValue?: string
  file: File | null | undefined
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void
}

function FileUpload({ acceptedFileTypes, name, placeholder, oldValue, file, isDisabled, onChangeFile }: FileUploadProps) {

  const inputRef = useRef() as RefObject<HTMLInputElement>;

  return (
    <FormControl>
      <FormLabel>Immagine</FormLabel>
      <InputGroup>
        <InputLeftElement zIndex="0" pointerEvents="none">
          <Icon  w="4" h="4" as={PhotographIcon} />
        </InputLeftElement>
        <input type='file'
          onChange={onChangeFile}
          accept={acceptedFileTypes}
          name={name}
          ref={inputRef}
          style={{ display: 'none' }} />
        <Input
          isDisabled={isDisabled}
          placeholder={placeholder}
          onClick={() => inputRef.current?.click()}
          readOnly={true}
          value={file && file.name || oldValue || ''}
        />
      </InputGroup>
    </FormControl>
  );
}

export default FileUpload;
