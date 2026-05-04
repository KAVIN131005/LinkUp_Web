import { useEffect } from 'react';

// Custom hook to update document title
const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} - Link Up`;
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
