import React from 'react';

interface FormattedTextProps {
  text: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ text }) => {
  return (
    <div className="whitespace-pre-wrap">
      {text.split('\\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i !== text.split('\\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FormattedText;
