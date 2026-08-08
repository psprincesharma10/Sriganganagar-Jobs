import React, { useEffect } from 'react';

interface SchemaMarkupProps {
  schemaData: object;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schemaData }) => {
  useEffect(() => {
    const scriptId = 'json-ld-schema-markup';
    let scriptElem = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptElem) {
      scriptElem = document.createElement('script');
      scriptElem.id = scriptId;
      scriptElem.type = 'application/ld+json';
      document.head.appendChild(scriptElem);
    }

    scriptElem.textContent = JSON.stringify(schemaData);

    return () => {
      // Clean up on unmount
      if (scriptElem && scriptElem.parentNode) {
        scriptElem.parentNode.removeChild(scriptElem);
      }
    };
  }, [schemaData]);

  return null;
};
