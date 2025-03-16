import React from 'react';
import DocumentUploadForm from "../../components/DocumentUploadForm/DocumentUploadForm";
import DocumentList from '../../components/DocumentsList/DocumentsList';

const DocumentsPage = () => {
  return (
    <>
    <DocumentUploadForm />
    <DocumentList />
    </>
    
  )
}

export default DocumentsPage;