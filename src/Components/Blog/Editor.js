import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { storage } from '../../config/firebase-config';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { async } from '@firebase/util';
import { useMemo, useRef } from 'react';
import { convertToWebP } from '../../Constants/commonFunctions';

export default function Editor({ value, onChange }) {
    const quillRef = useRef(null); // Ref to hold the Quill instance

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            // Check if the file is an image
            if (!file.type.startsWith('image/') || file.size > (1024 * 1024)) {
                console.error('Invalid file type or size too large');
                alert('Invalid file type or size too large. Please upload image of less than 1MB.');
                return;
            }
            const storageRef = ref(getStorage(), `blog-images/${file.name}`);

            try {
                // Convert image to WebP format with 70% compression quality
                // const convertedFile = await new Promise((resolve) => {
                //     const reader = new FileReader();
                //     reader.readAsDataURL(file);
                //     reader.onload = () => {
                //         const img = new Image();
                //         img.src = reader.result;
                //         img.onload = () => {
                //             const canvas = document.createElement('canvas');
                //             const ctx = canvas.getContext('2d');
                //             canvas.width = img.width;
                //             canvas.height = img.height;
                //             ctx.drawImage(img, 0, 0);
                //             canvas.toBlob((blob) => {
                //                 resolve(new File([blob], `${file.name}.webp`, { type: 'image/webp' }));
                //             }, 'image/webp', 0.7);
                //         };
                //     };
                // });

                const convertedFile = await convertToWebP(file)

                // Upload converted image to Firebase Storage
                const snapshot = await uploadBytes(storageRef, convertedFile);

                // Get download URL of uploaded image
                const imageUrl = await getDownloadURL(snapshot.ref);

                // Insert image into Quill editor
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, 'image', imageUrl);
            } catch (error) {
                console.error(error);
            }
        };
    };




    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],

                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction

                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'image': 'Upload Image' }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],

                ['clean']                                         // remove formatting button
            ],
            handlers: {
                image: handleImageUpload,
            },

        },
    }), []);



    // Custom handler for the "image" toolbar button
    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'blockquote', 'code-block', 'header', 'list',
        'script', 'indent', 'direction', 'size',
        'color', 'background', 'font', 'align',
        'image' // Add 'image' to the formats array
    ];


    return (
        <div className="content">
            <ReactQuill
                value={value}
                theme={'snow'}
                onChange={onChange}
                modules={modules}
                formats={formats}
                ref={quillRef}
            />
        </div>
    );
}




//   [
//     [{ header: [1, 2, false] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [
//         { list: 'ordered' },
//         { list: 'bullet' },
//         { indent: '-1' },
//         { indent: '+1' },

//     ],
//     ['link', 'image'],
//     ['clean'],
// ]


// const file = image;
//         const storageRef = ref(storage, `/files/${file.name}`);

//         try {
//             const uploadTaskSnapshot = await storageRef.child(`images/${file.name}`).put(file);
//             const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

//             const quill = this.quill;
//             const range = quill.getSelection(true);
//             quill.insertEmbed(range.index, 'image', downloadURL);
//         } catch (error) {
//             console.log('Error uploading file: ', error);
//         }