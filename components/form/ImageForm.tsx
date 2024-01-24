// ImageForm.tsx
import React from "react";
import SelectBlock from "@/components/form/select";

type Option = {
  title: string;
  value: string;
};

type ImageFormProps = {
  subject: string;
  location: string;
  onSubjectChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  subjectOptions: Option[];
  locationOptions: Option[];
  disabled: boolean;
  buttonText: string;
};

const ImageForm: React.FC<ImageFormProps> = ({
  subject,
  location,
  onSubjectChange,
  onLocationChange,
  onSubmit,
  subjectOptions,
  locationOptions,
  disabled,
  buttonText
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-none flex-row text-sm uppercase mx-auto h-fit p-8"
    >
      <div className="my-auto">A photo of a</div>
      <div className="my-auto">
        {/* Subject Select */}
        <SelectBlock
          items={subjectOptions}
          label="Subject"
          value={subject}
          onChange={onSubjectChange}
        />
      </div>
      <div className="my-auto">in</div>
      <div className="my-auto">
        {/* Location Select */}
        <SelectBlock
          items={locationOptions}
          label="Location"
          value={location}
          onChange={onLocationChange}
        />
      </div>
      <div>
        {/* Submit Button */}
        <button
          className="bg-white border border-white text-black h-full px-6 text-sm rounded hover:bg-opacity-0 hover:text-white disabled:opacity-10 disabled:hover:bg-white disabled:hover:text-black"
          type="submit"
          disabled={disabled}
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default ImageForm;
