import {Create, SimpleForm, TextInput, required} from "react-admin";

export const CourseCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="title" validate={[required()]} label="title" />
        <TextInput source="imageSrc" validate={[required()]} label="image" />
      </SimpleForm>
    </Create>
  );
};
