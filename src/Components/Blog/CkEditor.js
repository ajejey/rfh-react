import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DocumentEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { uploadToFireBase } from '../../Constants/commonFunctions';

const CkEditor = ({ value, onChange }) => {
    function uploadAdapter(loader) {
        return {
            upload: function() {
                return loader.file
                    .then(function(file) {
                        console.log("Uploading file: ", file);
                        return uploadToFireBase(file);
                    })
                    .then(function(url) {
                        console.log("Uploaded file URL: ", url);
                        return { default: url };
                    })
                    .catch(function(error) {
                        console.error("Upload failed: ", error);
                        return Promise.reject(error);
                    });
            }
        };
    }
    
    
    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = function(loader) {
            return new uploadAdapter(loader);
        };
    }
    return (
        <div>
            <CKEditor
                editor={DocumentEditor}
                data={value}
                onReady={editor => {
                    console.log('Editor is ready to use!', editor);
                    // Insert the toolbar before the editable area.
                    editor.ui.getEditableElement().parentElement.insertBefore(
                        editor.ui.view.toolbar.element,
                        editor.ui.getEditableElement()
                    );
                }}
                onChange={function(event, editor) {
                    const data = editor.getData();
                    console.log("data ", data);
                    onChange(data);
                }}
                config={{
                    extraPlugins: [uploadPlugin]
                }}
            />
        </div>
    );
};

export default CkEditor;
